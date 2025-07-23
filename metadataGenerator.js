const crypto = require('crypto');

function hashSensitiveData(record) {
    const hash = crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex');
    return hash;
}

function generateMetadata(metadata, record) {
    return {
        ...metadata,
        recordHash: hashSensitiveData(record)
    };
}

module.exports = { generateMetadata }; 