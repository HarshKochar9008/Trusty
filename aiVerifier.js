const REQUIRED_FIELDS = ['name', 'type', 'issuer', 'date', 'status'];

function verifyHealthRecord(record) {
    const missingFields = REQUIRED_FIELDS.filter(field => !(field in record));
    const isValid = missingFields.length === 0;
    return {
        isValid,
        missingFields,
        metadata: isValid ? {
            name: record.name,
            type: record.type,
            issuer: record.issuer,
            date: record.date,
            status: record.status
        } : null
    };
}

const axios = require('axios');

async function verifyHealthRecordLLM(record) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not set in .env');
    }
    const prompt = `You are a medical records verification assistant. Given the following health record JSON, check if it is authentic, complete, and plausible. List any missing or suspicious fields, and return a JSON object with { isValid, missingFields, suspiciousFields, summary }.

Health Record:
${JSON.stringify(record, null, 2)}
`;
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a medical records verification assistant.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 300,
            temperature: 0.2
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );
    const text = response.data.choices[0].message.content;
    try {
        return JSON.parse(text);
    } catch (e) {
        return { isValid: false, error: 'LLM response not valid JSON', raw: text };
    }
} 