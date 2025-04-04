const jwt = require('jsonwebtoken');
const config = require('./config');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'Token não fornecido.' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        
        if (err) {
            return res.status(403).json({ success: false, message: 'Token não é válido' });
        }
        else {
            req.decoded = { id_user: decoded.id_utilizador };
            next();
        }
    });
};

module.exports = { checkToken };


