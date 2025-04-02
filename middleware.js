const jwt = require('jsonwebtoken');
const config = require('./config');

let checkToken = (req, res, next) => {
    console.log('Received headers:', req.headers); // Debug line 1
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
    console.log('Extracted token:', token); // Debug line 2

    if (!token) {
        console.log('No token found'); // Debug line 3
        return res.status(401).send({ auth: false, message: 'Token não fornecido.' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        console.log('Token after Bearer removal:', token); // Debug line 4
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        console.log('JWT verify result - error:', err); // Debug line 5
        console.log('JWT verify result - decoded:', decoded); // Debug line 6
        
        if (err) {
            return res.status(403).json({ success: false, message: 'Token não é válido' });
        }
        else {
            req.decoded = { id_user: decoded.id_utilizador };
            console.log('Authentication successful, decoded:', req.decoded); // Debug line 7
            next();
        }
    });
};

module.exports = { checkToken };


