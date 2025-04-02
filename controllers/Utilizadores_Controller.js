var Utilizadores = require('../models/Utilizadores')
var AuditLog = require('../models/AuditLog')
const controller = {};
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config')

function getDate() {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let today = `${yyyy}-${mm}-${dd}`;
    return today;
}

controller.utilizadoresLogin = async function (req, res) {
    if (req.body.nome_utilizador && req.body.password) {
        var nome_user = req.body.nome_utilizador;
        var password = req.body.password;
    }
    var user = await Utilizadores.findOne({ where: { nome_utilizador: nome_user } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            console.log("Erro: " + error);
            return error;
        })
    if (password === null || typeof password === "undefined") {
        res.status(403).json({
            success: false,
            message: 'Campos em Branco'
        });
    } else {
        if (req.body.nome_utilizador && req.body.password && user) {
            const isMatch = bcrypt.compareSync(password, user.pass);
            if (req.body.nome_utilizador === user.nome_utilizador && isMatch) {
                let token = jwt.sign({
                    id_utilizador: user.id_utilizador
                },
                    config.jwtSecret
                );

                if (user.estado == "Ativa") {
                    res.json({
                        success: true,
                        message: 'Autenticação realizada comsucesso!',
                        token: token,
                        id_utilizador: user.id_utilizador,
                        tipo: user.id_tipo,
                        estado: user.estado,
                        nome_utilizador: user.nome_utilizador
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: 'Conta não está ativa.'
                    });
                }

                await AuditLog.create({
                    utilizador: user.id_utilizador,
                    data_atividade: getDate(),
                    tipo_atividade: "Login",
                    descricao: "Utilizador com nome " + user.nome_utilizador + " fez login."
                })
            }
            else {
                res.status(403).json({
                    success: false,
                    message: 'Dados de autenticação inválidos.'
                });
            }
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Erro no processo de autenticação. Tente de novo mais tarde.'
            });
        }
    }
}

controller.utilizadoresCreate = async function (req, res) {
    const { id_tipo, nome_utilizador, pass, estado, validade_token } = req.body;

    const user = await Utilizadores.findAll({ where: { nome_utilizador: nome_utilizador } })

    if (user.length > 0) {
        return res.status(500).json({
            success: false,
            message: "Já existe um utilizador com esse nome",
        })
    }

    const data = await Utilizadores.create({
        id_tipo: id_tipo,
        nome_utilizador: nome_utilizador,
        pass: pass,
        estado: estado,
        created_at: getDate(),
        updated_at: getDate()
    })
        .then(function (data) {
            res.status(200).json({
                success: true,
                message: "Utilizador criado",
                data: data
            })
        })
        .catch(error =>
            res.status(500).json({
                success: false,
                message: "Erro a criar o Utilizador",
                error: error.message
            })
        )

    console.log(data)
    if (data) {
        await AuditLog.create({
            utilizador: user.id_utilizador,
            data_atividade: getDate(),
            tipo_atividade: "Registo",
            descricao: "Utilizador com nome " + user.nome_utilizador + " fez registo."
        })
    }
}

controller.utilizadoresList = async function (req, res) {
    const data = await Utilizadores.findAll({ order: ['nome_utilizador'] })
        .then(function (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a listar os registos",
                error: error.message
            });
        });
}

controller.utilizadoresListTipo = async function (req, res) {
    const { id } = req.params
    const data = await Utilizadores.findAll({ order: ['nome_utilizador'] }, { where: { id_tipo: id } })
        .then(function (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a listar os registos",
                error: error.message
            });
        });
}

controller.utilizadoresListEstado = async function (req, res) {
    const { est } = req.params
    const data = await Utilizadores.findAll({ order: ['nome_utilizador'] }, { where: { estado: est } })
        .then(function (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a listar os registos",
                error: error.message
            });
        });
}

controller.utilizadoresGet = async function (req, res) {
    const { id } = req.params;
    const data = await Utilizadores.findAll({
        where: { id_utilizador: id }
    })
        .then(function (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a encontrar o auditlog",
                error: error
            });
        })
}

controller.utilizadoresDelete = async function (req, res) {
    const { id } = req.params;
    const data = await Utilizadores.destroy({
        where: { id_utilizador: id }
    })
        .then(function () {
            res.status(200).json({
                success: true,
                message: "AuditLog Apagado"
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a apagar o AuditLog",
                error: error.message
            });
        })
}

controller.utilizadoresUpdate = async function (req, res) {
    const { id } = req.params;
    const { id_tipo, id_perfil, nome_utilizador, estado } = req.body;
    const data = await Utilizadores.update({
        id_tipo: id_tipo,
        nome_utilizador: nome_utilizador,
        estado: estado,
        updated_at: getDate()
    }, {
        where: { id_utilizador: id }
    })
        .then(function () {
            res.status(200).json({
                success: true,
                message: "AuditLog Apagado"
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a apagar o AuditLog",
                error: error.message
            });
        })
}

controller.utilizadoresAtivarConta = async function (req, res) {
    const { id } = req.params;
    const data = await Utilizadores.update({
        estado: "Ativa",
        updated_at: getDate()
    }, {
        where: { id_utilizador: id }
    })
        .then(function () {
            res.status(200).json({
                success: true,
                message: "AuditLog Apagado"
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a apagar o AuditLog",
                error: error.message
            });
        })
}

controller.utilizadoresDesativarConta = async function (req, res) {
    const { id } = req.params;
    const data = await Utilizadores.update({
        estado: "Desativada",
        updated_at: getDate()
    }, {
        where: { id_utilizador: id }
    })
        .then(function () {
            res.status(200).json({
                success: true,
                message: "AuditLog Apagado"
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a apagar o AuditLog",
                error: error.message
            });
        })
}

controller.ResgatePassword = async function (req, res) {
    const { nome_utilizador } = req.body;

    try {
        const token = Math.floor(100000 + Math.random() * 900000).toString(); //Número com 6 dígitos

        const validadeToken = new Date(Date.now() + 30 * 60 * 1000); //Validade do token de 30 minutos

        const data = await Utilizadores.update(
            {
                token_resgate: token,
                validade_token: validadeToken,
            },
            {
                where: { nome_utilizador: nome_utilizador },
            }
        ).then(function () {
            res.status(200).json({
                success: true,
                message: "Token gerado com sucesso",
                token: token
            })
        })
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

controller.ResetPassword = async (req, res) => {
    const { nome_utilizador, token, newPassword } = req.body;

    try {
        const user = await Utilizadores.findOne({ where: { nome_utilizador: nome_utilizador } });

        if (!user) {
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        }

        const currentDate = new Date();
        if (user.token_resgate === token && currentDate < user.validade_token) {
            console.log('Received newPassword:', newPassword);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await Utilizadores.update(
                {
                    pass: hashedPassword,
                    token_resgate: null,
                    validade_token: null,
                },
                {
                    where: { nome_utilizador: nome_utilizador },
                }
            );

            res.status(200).json({
                success: true,
                message: 'Password alterada com sucesso'
            });
        } else {
            res.status(400).json({
                message: 'Token não é válido'
            });
        }
    } catch (error) {
        console.error('Erro a alterar a password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = controller;