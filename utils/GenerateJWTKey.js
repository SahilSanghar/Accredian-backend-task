const fs = require('fs');
const crypto = require('crypto');

// Function to generate a random key
const generateRandomKey = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

// Generate a 256-bit (32-byte) random key for JWT secret
const jwtSecret = generateRandomKey(32);

// Write JWT secret to .env file
fs.writeFileSync('.env', `JWT_SECRET=${jwtSecret}\n`, { flag: 'a' });

console.log('JWT Secret generated and saved to .env file.');
