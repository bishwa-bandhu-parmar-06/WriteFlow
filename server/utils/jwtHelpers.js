const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};

module.exports = { generateToken };
