const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { verifyHealthRecord } = require('./aiVerifier');
const { generateMetadata } = require('./metadataGenerator');
const { hederaClient, submitToHCS } = require('./hederaClient');
require('dotenv').config();
const cors = require('cors');
const { Client, TopicMessageQuery, TopicInfoQuery } = require("@hashgraph/sdk");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfjsLib = require('pdfjs-dist');
const { createCanvas } = require('canvas');
const crypto = require('crypto');

async function extractWithGemini(filePath, originalName) {
    const ext = path.extname(originalName).toLowerCase();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let geminiResult = null;
    if ([
        '.png', '.jpg', '.jpeg', '.bmp', '.tiff'
    ].includes(ext)) {
        const imageBuffer = fs.readFileSync(filePath);
        geminiResult = await model.generateContent([
            { inlineData: { mimeType: 'image/png', data: imageBuffer.toString('base64') } },
            { text: 'Extract all structured data, tables, and key information from this medical record image. Respond in JSON.' }
        ]);
    } else if (ext === '.pdf') {
        const data = new Uint8Array(fs.readFileSync(filePath));
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        let allResults = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');
            await page.render({ canvasContext: context, viewport }).promise;
            const imgBuffer = canvas.toBuffer('image/png');
            const result = await model.generateContent([
                { inlineData: { mimeType: 'image/png', data: imgBuffer.toString('base64') } },
                { text: `Extract all structured data, tables, and key information from page ${i} of this medical record PDF. Respond in JSON.` }
            ]);
            allResults.push(result);
        }
        geminiResult = allResults;
    } else {
        throw new Error('Unsupported file type for Gemini extraction. Only images and PDFs are supported.');
    }
    return geminiResult;
}

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors());

app.post('/api/verify', upload.single('record'), async (req, res) => {
    try {
        let geminiResult = null;
        if (req.file) {
            const filePath = path.resolve(req.file.path);
            try {
                geminiResult = await extractWithGemini(filePath, req.file.originalname);
            } catch (e) {
                fs.unlinkSync(filePath);
                return res.status(400).json({ error: e.message });
            }
            fs.unlinkSync(filePath);
        } else {
            return res.status(400).json({ error: 'No health record file provided.' });
        }

        const extractedJson = JSON.stringify(geminiResult, null, 2);
        const hash = crypto.createHash('sha256').update(extractedJson).digest('hex');

        const metadata = {
            hash,
            timestamp: new Date().toISOString(),
            status: 'verified',
            model: 'gemini-1.5-flash'
        };

        let txId = null;
        let hashscanUrl = null;
        try {
            const client = hederaClient();
            const topicId = process.env.HEDERA_TOPIC_ID;
            if (!topicId) throw new Error('HEDERA_TOPIC_ID not set in .env');
            const txResponse = await submitToHCS(client, topicId, JSON.stringify(metadata));
            txId = txResponse.transactionId.toString();
            hashscanUrl = `https://hashscan.io/testnet/transaction/${txId}`;
        } catch (err) {}
        res.json({
            geminiResult,
            metadata,
            hashscanUrl
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Health Record Verifier API is running.');
});

app.get("/api/topic/messages", async (req, res) => {
    try {
        const client = hederaClient();
        const topicId = process.env.HEDERA_TOPIC_ID;
        if (!topicId) {
            return res.status(500).json({ error: "HEDERA_TOPIC_ID not set in .env" });
        }
        let messages = [];
        let count = 0;
        await new TopicMessageQuery()
            .setTopicId(topicId)
            .setLimit(20)
            .subscribe(client, null, (msg) => {
                messages.push({
                    consensusTimestamp: msg.consensusTimestamp.toString(),
                    message: msg.contents.toString(),
                    runningHash: msg.runningHash.toString(),
                    sequenceNumber: msg.sequenceNumber
                });
                count++;
                if (count >= 20) {
                    res.json({ messages });
                    client.close();
                }
            },
            (err) => {
                res.status(500).json({ error: err.message });
                client.close();
            },
            () => {
                if (messages.length > 0) {
                    res.json({ messages });
                }
                client.close();
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/topic/info", async (req, res) => {
    try {
        const client = hederaClient();
        const topicId = process.env.HEDERA_TOPIC_ID;
        if (!topicId) {
            return res.status(500).json({ error: "HEDERA_TOPIC_ID not set in .env" });
        }
        const info = await new TopicInfoQuery().setTopicId(topicId).execute(client);
        res.json({
            topicId,
            memo: info.topicMemo,
            runningHash: info.runningHash.toString(),
            sequenceNumber: info.sequenceNumber,
            expirationTime: info.expirationTime ? info.expirationTime.toString() : null,
            autoRenewAccountId: info.autoRenewAccountId ? info.autoRenewAccountId.toString() : null,
            autoRenewPeriod: info.autoRenewPeriod ? info.autoRenewPeriod.seconds.toString() : null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
}); 