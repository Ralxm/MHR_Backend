const Faltas = require('../models/Faltas');
const User = require('../models/User');
var sequelize = require('../models/database');


const controllers = {};

sequelize.sync();

controllers.falta_lista_user = async (req, res) => {
    try {
        const { id_user } = req.params;

        const user = await User.findOne({ where: { id_user } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }

        const faltas = await Faltas.findAll({ where: { id_calendario: user.id_calendario } });

        const faltasComUsers = await Promise.all(
            faltas.map(async (faltas) => {
                const autor = await User.findOne({ where: { id_calendario: faltas.id_calendario } });

                return {
                    ...faltas.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        res.json({ success: true, faltasComUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar férias", error });
    }
}

controllers.download_file = async (req, res) => {
    const { justificacao } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', 'files', justificacao);

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao transferir ficheiro', error: err });
        }
    });
}



controllers.falta_adicionar = async (req, res) => {
    const { id_user, data_falta, estado, tipo } = req.body;
    const justificacao = req.file ? req.file.path : null;

    try {
        const user = await User.findOne({ where: { id_user } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }

        const data = await Faltas.create({
            id_user: user.id_user,
            id_calendario: user.id_calendario,
            justificacao: justificacao,
            data_falta: data_falta,
            estado: estado,
            tipo: tipo,
        })
            .then(function (data) {
                return data;
            })
            .catch(error => {
                return error;
            });
        res.json({ success: true, data: data });
    } catch (error) {
        console.log(error);
    }
};

controllers.faltas_lista = async (req, res) => {
    try {
        const faltas = await Faltas.findAll();
        const faltasComUsers = await Promise.all(
            faltas.map(async (faltas) => {
                const autor = await User.findOne({ where: { id_calendario: faltas.id_calendario } });

                return {
                    ...faltas.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        res.json({ success: true, faltasComUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar faltas", error });
    }
}

controllers.faltas_aprovar = async (req, res) => {
    try {
        const { id_falta } = req.params;
        const { validador, tipo } = req.body;

        const faltas = await Faltas.update({ estado: 'Aprovada', validador: validador, tipo: tipo }, { where: { id_falta } });
        res.json({ success: true, faltas });
    } catch (error) {
        console.error("Erro ao aprovar solicitação de faltas:", error);
        res.status(500).json({ success: false, message: "Erro interno ao aprovar solicitação de faltas." });
    }
};

controllers.faltas_rejeitar = async (req, res) => {
    try {
        const { id_falta } = req.params;
        const { validador, comentarios } = req.body;
        const faltas = await Faltas.update({ estado: 'Rejeitada', validador: validador, comentarios: comentarios }, { where: { id_falta } });
        res.json({ success: true, faltas });
    } catch (error) {
        console.error("Erro ao aprovar solicitação de faltas:", error);
        res.status(500).json({ success: false, message: "Erro interno ao aprovar solicitação de faltas." });
    }
};
controllers.falta_apagar = async (req, res) => {
    const { id_falta } = req.body;
    const data = await Faltas.destroy({ where: { id_falta: id_falta } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Falta apagada com sucesso!",
        data: data
    });
}

controllers.falta_atualizar = async (req, res) => {
    const { id_falta, id_user, data_falta, motivo } = req.body;
    const data = await Faltas.update({
        id_user: id_user,
        data_falta: data_falta,
        motivo: motivo
    }, { where: { id_falta: id_falta } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Falta atualizada com sucesso!",
        data: data
    });
}

controllers.falta_detalhes = async (req, res) => {
    const { id_falta } = req.params;
    const data = await Faltas.findAll({ where: { id_falta: id_falta } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}

controllers.falta_adicionar_justificacao = async (req, res) => {
    const { id_falta } = req.params;
    const justificacao = req.file ? req.file.path : null;

    try {
        const data = await Faltas.update({ justificacao: justificacao, tipo: 'Justificada' }, { where: { id_falta } });
        res.json({ success: true, data: data });
    }
    catch (error) {
        console.error("Erro ao adicionar justificação de falta:", error);
        res.status(500).json({ success: false, message: "Erro interno ao adicionar justificação de falta." });
    }
}
module.exports = controllers;