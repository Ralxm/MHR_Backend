const User = require('../models/User');
const calendarioController = require('./calendarioController');
const UserVisitante = require('../models/Perfil_visitante');


const sequelize = require('../models/database');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const config = require('../config');

const controllers = {};
sequelize.sync();

controllers.login_colaborador = async (req, res) => {
    const { nome_utilizador, pass } = req.body;


    if (!nome_utilizador || !pass) {
        return res.status(400).json({ success: false, message: 'Nome de utilizador e senha são obrigatórios' });
    }


    try {
        const user = await User.findOne({ where: { nome_utilizador: nome_utilizador } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Utilizador não encontrado' });
        }


        const isMatch = bcrypt.compare(pass, user.pass).then(function (result) {
            return result;
        });


        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: user.id_user, tipo_user: user.tipo_user, id_calendario: user.id_calendario, id_empresa: user.id_empresa }, config.jwtSecret, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: "Autenticação bem-sucedida",
            token: token,
            user: {
                id: user.id_user,
                nome_utilizador: user.nome_utilizador,
                pass: user.pass,
                tipo_user: user.tipo_user,
                id_calendario: user.id_calendario,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Erro durante a autenticação:", error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
}


controllers.login_visitante = async (req, res) => {
    const { email, pass } = req.body;


    if (!email || !pass) {
        return res.status(400).json({ success: false, message: 'Nome de utilizador e senha são obrigatórios' });
    }


    try {
        const user = await UserVisitante.findOne({ where: { email} });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Utilizador não encontrado' });
        }


        const isMatch = bcrypt.compare(pass, user.pass).then(function (result) {
            return result;
        });


        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: user.id_user_visitante, email: user.email }, config.jwtSecret, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: "Autenticação bem-sucedida",
            token: token,
            user: {
                id: user.id_user_visitante,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Erro durante a autenticação:", error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
}
controllers.registo_colaborador = async (req, res) => {
    const { nome_utilizador, pass, email, telemovel, data_nascimento, genero } = req.body;
    const imagem = req.file ? req.file.path : null;

    const imagemAtualizada = imagem ? imagem : 'public/img/user.png';

    if (!nome_utilizador || !pass || !email || !telemovel || !data_nascimento || !genero) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    const transaction = await sequelize.transaction();

    try {
        const existingUser = await User.findOne({ where: { nome_utilizador: nome_utilizador } });
        if (existingUser) {
            await transaction.rollback();
            return res.status(409).json({ success: false, message: 'Nome de utilizador já em uso', field: 'nome_utilizador' });
        }

        const existingEmail = await User.findOne({ where: { email: email } });
        if (existingEmail) {
            await transaction.rollback();
            return res.status(409).json({ success: false, message: 'Email já em uso', field: 'email' });
        }

        const hashedPass = await bcrypt.hash(pass, 10);

        const newUser = await User.create({
            nome_utilizador,
            pass: hashedPass,
            email,
            telemovel,
            data_nascimento,
            genero,
            tipo_user: "colaborador",
            foto_perfil: imagemAtualizada,
        }, { transaction });

        const novoCalendario = await calendarioController.calendario_criar(newUser.id_user, transaction);

        await newUser.update({ id_calendario: novoCalendario.id_calendario }, { transaction });

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: "Registo efetuado com sucesso!",
            data: newUser,
            calendario: novoCalendario
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Erro durante o registo:", error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
};

controllers.perfil_colaborador = async (req, res) => {
    const { id_user } = req.params;
    const perfil = await User.findOne({
        where: {
            id_user
        }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, perfil });
}

controllers.alterar_palavra_passe = async (req, res) => {
    const { id_user } = req.params;
    const { passAntiga, passNova, confirmaPass } = req.body;

    try {

        if (!passAntiga || !passNova || !confirmaPass) {
            return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
        }

        if (passNova !== confirmaPass) {
            return res.status(400).json({ success: false, message: 'A nova senha e a confirmação não coincidem.' });
        }

        const user = await User.findOne({ where: { id_user } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador não encontrado' });
        }
        
        const isMatch =  await bcrypt.compare(passAntiga, user.pass);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Senha incorreta' });
        }

        const hashedPass = await bcrypt.hash(passNova, 10);

        const [updated] = await User.update({ pass: hashedPass }, { where: { id_user } });
        if (!updated) {
            return res.status(400).json({ success: false, message: 'Falha ao alterar a senha' });
        }

        res.json({ success: true, message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ success: false, message: 'Erro ao alterar senha', error: error.message });
    }
};

controllers.listar_colaboradores = async (req, res) => {
    const data = await User.findAll()
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}


module.exports = controllers;
