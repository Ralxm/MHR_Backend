const Empresa = require('../models/Empresa');
var sequelize = require('../models/database');
const AuditLog = require('../models/AuditLog')

const controllers = {};

function getDate() {
    let now = new Date();
    
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();

    let hh = now.getHours();
    let min = now.getMinutes();
    let ss = now.getSeconds();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hh < 10) hh = '0' + hh;
    if (min < 10) min = '0' + min;
    if (ss < 10) ss = '0' + ss;

    let datetime = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    return datetime;
}

controllers.empresaGet = async (req, res) => {
    const data = await Empresa.findAll({ where: { id_empresa: 1 } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}


controllers.empresaUpdate = async (req, res) => {
    const { nome_empresa, contacto_empresa, email_empresa } = req.body;

    try {
        const data = await Empresa.update({
            nome_empresa: nome_empresa,
            contacto_empresa: contacto_empresa,
            email_empresa: email_empresa
        }, {
            where: {
                id_empresa: 1   
            }
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Edição das informações da empresa",
            descricao: "Edição das informações da empresa"
        })

        res.status(200).json({
            success: true,
            data: data,
            message: 'Informações da empresa atualizadas com sucesso'
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Erro a atualizar as informações da empresa'
        })
    }
}

module.exports = controllers;