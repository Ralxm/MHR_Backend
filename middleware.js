const jwt = require('jsonwebtoken');
const config = require('./config');

let checkToken = (req, res, next) => {

    console.log('Request Headers:', req.headers);
    
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
    
    if (!token) {
        return res.status(401).send({ auth: false, message: 'Token não fornecido.' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    console.log('Token:', token);

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ success: false, message: 'Token não é válido' });
        } else {
            console.log('Decoded:', decoded);

            if (!req.decoded) {
                req.decoded = {};
            }
            
            req.decoded.id_user = decoded.id;

            next();
        }
    });
};

module.exports = { checkToken };
