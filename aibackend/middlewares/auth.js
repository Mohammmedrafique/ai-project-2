
const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); 
require('dotenv').config();

module.exports = async (req, res, next) => {
    const token = req.get('Authorization')?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    } catch (err) {
        console.error('JWT Error:', err); // Log the error
        res.status(401).json({ message: 'Token is not valid' });
    }
};


