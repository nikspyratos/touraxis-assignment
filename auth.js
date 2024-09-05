const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Read the secret key from a file
const secretKey = fs.readFileSync(path.join(__dirname, 'jwtSecret.key'), 'utf8').trim();

const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { generateToken, authMiddleware };