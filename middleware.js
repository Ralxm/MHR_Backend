const jwt = require('jsonwebtoken');
const config = require('./config');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];

    //Se não existir um token no pedido, envia uma resposta a negar a autorização.
    if (!token) {
        return res.status(401).send({ auth: false, message: 'Token não fornecido.' });
    }

    //Se o token começar com a palavra "Bearer" remove-a para que o token possa ser lido
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    //Utilizamos a função verify() do jsonwebtoken para verificar a vericidade do token fornecido
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        //Se o token não for autentico ou invalido, envia uma resposta a negar a autorização.
        if (err) {
            return res.status(403).json({ success: false, message: 'Token não é válido' });
        }
        //Se o token for válido 
        else {
            if (!req.decoded) {
                req.decoded = {};
            }

            req.decoded.id_user = decoded.id;

            next();
        }
    });
};

module.exports = { checkToken };


