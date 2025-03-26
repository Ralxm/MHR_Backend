const Despesas = require('../models/Despesas');;
var sequelize = require('../models/database');
const { Op } = require('sequelize');

const controller = {};

function getDate(){
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let today = `${yyyy}-${mm}-${dd}`;
    return today;
}

controller.despesasCreate = async function (req, res){
    const { id_departamento, id_projeto, id_perfil, _data, descricao, valor, validador, estado, reembolsado_por, comentarios} = req.body;
    const anexo = req.file ? req.file.path : null;

    const data = await Despesas.create({
        id_departamento: id_departamento,
        id_projeto: id_projeto,
        id_perfil: id_perfil,
        data: _data,
        descricao: descricao,
        valor: valor,
        anexo: anexo,
        validador: validador,
        estado: estado,
        reembolsado_por: reembolsado_por,
        comentarios: comentarios,
        created_at: getDate(),
        updated_at: getDate()
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Despesa criado",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar a Despesa",
            error: error.message
        })
    )
}

controller.despesasList = async function (req, res){
    try {
        const data = await Despesas.findAll({
            order: ['data']
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as despesas",
            error: error.message
        });
    }
}

controller.despesasListPorUser = async function (req, res){
    const { id } = req.params;
    try {
        const data = await Despesas.findAll({
            order: ['data']
        },{
            where: {id_perfil: id}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as despesas",
            error: error.message
        });
    }
}

controller.despesasListAprovadasPorUser = async function (req, res){
    const { id } = req.params;
    try {
        const data = await Despesas.findAll({
            order: ['data']
        },{
            where: {validador: id, estado: "Aprovada"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as despesas",
            error: error.message
        });
    }
}

controller.despesasListAprovadas = async function (req, res){
    try {
        const data = await Despesas.findAll({
            order: ['data']
        },{
            where: {estado: "Aprovada"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as despesas",
            error: error.message
        });
    }
}

controller.despesasListRejeitadas = async function (req, res){
    try {
        const data = await Despesas.findAll({
            order: ['data']
        },{
            where: {estado: "Rejeitada"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as despesas",
            error: error.message
        });
    }
}

controller.despesasListPorAprovar = async function (req, res){
    try {
        const data = await Despesas.findAll({
            where: {
                estado: { [Op.or]: ["Por Aprovar", "Pendente"] }
            },
            order: [['data', 'ASC']]
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as despesas",
            error: error.message
        });
    }
}

controller.despesasListRejeitadasPorUser = async function (req, res){
    const { id } = req.params;
    try {
        const data = await Despesas.findAll({
            order: ['data']
        },{
            where: {validador: id, estado: "Rejeitada"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as despesas",
            error: error.message
        });
    }
}

controller.despesasGet = async function (req, res){
    const { id } = req.params;

    try {
        const data = await Despesas.findAll({
            where: { id_despesa: id }
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao encontrar a despesa",
            error: error.message
        });
    }
}

controller.despesasDelete = async function (req, res){
    const { id } = req.params;
    const data = await Despesas.destroy({
        where: {id_despesa: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Despesa apagada"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a despesa",
            error: error.message
        });
    })
}

controller.despesasUpdate = async function (req, res) {
    const { id } = req.params;
    const { id_departamento, id_projeto, id_perfil, _data, descricao, valor, validador, estado, reembolsado_por, comentarios} = req.body;

    try {
        //Encontra o comentário que vamos atualizar
        const comentarioProjeto = await Despesas.findOne({ where: { id_despesa: id } });

        //Se não encontrar o comentário responde com um erro
        if (!comentarioProjeto) {
            return res.status(404).json({
                success: false,
                message: "Despesa não encontrada"
            });
        }

        //Esta parte do código verifica se o comentario já tem um ficheiro. Se sim, apaga-o e troca-o por um novo.
        //Se não for inserido nenhum ficheiro diferente/novo na atualização então o ficheiro anterior mantém-se
        let anexo = comentarioProjeto.anexo;
        if (req.file) {
            if (anexo) {
                fs.unlinkSync(path.resolve(anexo));
            }
            anexo = req.file.path;
        }

        await Comentarios_Projetos.update({
            id_departamento: id_departamento,
            id_projeto: id_projeto,
            id_perfil: id_perfil,
            data: _data,
            descricao: descricao,
            valor: valor,
            anexo: anexo,
            validador: validador,
            estado: estado,
            reembolsado_por: reembolsado_por,
            comentarios: comentarios,
            created_at: getDate(),
            updated_at: getDate()
        }, {
            where: { id_despesa: id }
        });

        res.status(200).json({
            success: true,
            message: "Despesa atualizado com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar a despesa",
            error: error.message
        });
    }
};


/*controllers.despesas_adicionar = async (req, res) => {
    const { id_user, data, descricao, valor, id_projeto } = req.body;

    try {

        const despesa = await Despesas.create({
            id_user: id_user,
            data: data,
            descricao: descricao,
            valor: valor,
            id_projeto: id_projeto || null,
            destinatario: id_user,
            estado: "Pendente",
        });
        res.status(201).json({
            success: true,
            message: "Despesa adicionada com sucesso!",
            despesa
        });
    } catch (error) {
        console.error("Error adding despesa:", error);
        res.status(500).json({

            success: false,
            message: "Erro ao adicionar despesa.",
            error: error.message
        });
    }
}

controllers.despesas_lista_user = async (req, res) => {
    const { id_user } = req.params;
    try {
        const despesas = await Despesas.findAll({where: {id_user}});
        const reembolsos = await Reembolsos.findAll({where: 
            { destinatario: id_user }
        });

        const despesasComReembolsos = await Promise.all(
            despesas.map(async (despesa) => {
                const reembolso = await Reembolsos.findOne({where:{id_despesa: despesa.id_despesa}});
                const projeto = await Projetos.findOne({ where: { id_projeto: despesa.id_projeto } });

                return {
                    ...despesa.toJSON(),
                    data_reembolso: reembolso ? reembolso.data_reembolso : 'Sem data de reembolso',
                    projeto: projeto ? projeto.titulo_projeto : 'Sem projeto associado',
                };
            })
        );

        const reembolsosSemDespesas = await Promise.all(
            reembolsos
                .filter(r => r.id_despesa === null)
                .map(async (reembolso) => {
                    const projeto = await Projetos.findOne({ where: { id_projeto: reembolso.id_projeto } });

                    return {
                        ...reembolso.toJSON(),
                        data_reembolso: reembolso ? reembolso.data_reembolso : 'Sem data de reembolso',
                        projeto: projeto ? projeto.titulo_projeto : 'Sem projeto associado',
                    };
                })
        );

        const despesasComReembolsosUser = despesasComReembolsos.concat(reembolsosSemDespesas);
        res.json({ success: true, despesasComReembolsosUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.despesas_lista = async (req, res) => {
    try {
        const despesas = await Despesas.findAll();
        const reembolsos = await Reembolsos.findAll();

        const despesasComReembolsos = await Promise.all(
            despesas.map(async (despesa) => {
                const reembolso = await Reembolsos.findOne({where:{id_despesa: despesa.id_despesa}});
                const projeto = await Projetos.findOne({ where: { id_projeto: despesa.id_projeto } });
                const autor = await User.findOne({ where: { id_user: despesa.id_user } });

                let destinatarioNome = 'Próprio';
                if (reembolso && reembolso.destinatario) {
                    const destinatario = await User.findOne({ where: { id_user: reembolso.destinatario } });
                    destinatarioNome = destinatario ? destinatario.nome_utilizador : 'Próprio';
                }

                return {
                    ...despesa.toJSON(),
                    data_reembolso: reembolso ? reembolso.data_reembolso : 'Sem data de reembolso',
                    destinatario: destinatarioNome,
                    projeto: projeto ? projeto.titulo_projeto : 'Sem projeto associado',
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );


        const reembolsosSemDespesas = await Promise.all(
            reembolsos
                .filter(r => r.id_despesa === null)
                .map(async (reembolso) => {
                    const destinatario = await User.findOne({ where: { id_user: reembolso.destinatario } });
                    const projeto = await Projetos.findOne({ where: { id_projeto: reembolso.id_projeto } });
                    const destinatarioNome = destinatario ? destinatario.nome_utilizador : 'Desconhecido';
                    const autor = await User.findOne({ where: { id_user: reembolso.id_user } });
                    
                    return {
                        ...reembolso.toJSON(),
                        id_despesa: 'Sem despesa associada',
                        data_reembolso: reembolso ? reembolso.data_reembolso : 'Sem data de reembolso',
                        destinatario: destinatarioNome,
                        projeto: projeto ? projeto.titulo_projeto : 'Sem projeto associado',
                        autor:  autor ? autor.nome_utilizador : 'Sem autor'
                    };
                })
        );

        const todosRembolsosDespesas = despesasComReembolsos.concat(reembolsosSemDespesas);
        res.json({ success: true, todosRembolsosDespesas });
    } catch (error) {
        console.error('Erro ao procurar despesas:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar despesas' });
    }
};


controllers.despesas_editar = async (req, res) => {
    const {id_despesa} = req.params;
    const { data, descricao, valor, id_projeto } = req.body;
    const despesas = await Despesas.findOne({ where: { id_despesa } });
    if (!despesas) {
        return res.status(404).json({ success: false, message: "Despesa não encontrada." });
    }
    try {
        const despesa = await Despesas.update({
            data: data,
            descricao:descricao,
            valor:valor,
            id_projeto:id_projeto
        }, {
            where: {
                id_despesa
            }
        });
        if (despesa[0] === 0) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }
        res.json({ success: true, message: "Despesa atualizada com sucesso." });
    } catch (error) {
        console.error("Error updating despesa:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar despesa.",
            error: error.message
        });
    }
}

controllers.despesas_apagar = async (req, res) => {
    const { id_despesa } = req.params;

    try {
        const data = await Despesas.destroy({
            where: {
                id_despesa
            }
        });
        if (data === 0) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }
        res.json({ success: true, message: "Despesa apagada com sucesso." });
    } catch (error) {
        console.error("Error deleting despesa:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao apagar despesa.",
            error: error.message
        });
    }
}

controllers.despesas_detalhes = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Despesas.findOne({
            where: {
                id_despesa: id
            }
        });
        if (!data) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching despesa details:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao mostrar detalhes da despesa.",
            error: error.message
        });
    }
}

controllers.despesas_aprovar = async (req, res) => {
    const { id_despesa } = req.params;
    const { validador } = req.body;

    try {
        const atualizarDespesa = await Despesas.update({
            estado: "Aprovado",
            validador: validador
        }, {
            where: {
                id_despesa
            }
        });
        if (atualizarDespesa[0] === 0) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }
        const despesa = await Despesas.findOne({ where: { id_despesa } });
        if (!despesa) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada após atualização." });
        }
        await Reembolsos.create({
            id_despesa: despesa.id_despesa,
            id_user: despesa.id_user,
            descricao: despesa.descricao,
            valor: despesa.valor,
            data_despesa: despesa.data,
            data_reembolso: new Date(),
            estado: "Aprovada"
        });
        res.json({ success: true, message: "Despesa aprovada com sucesso." });
    } catch (error) {
        console.error("Error approving despesa:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao aprovar despesa.",
            error: error.message
        });
    }
}
controllers.despesas_rejeitar = async (req, res) => {
    const { id_despesa } = req.params;
    const { validador, comentarios } = req.body;

    try {
        const atualizarDespesa = await Despesas.update({
            estado: "Rejeitado",
            validador: validador,
            comentarios: comentarios
        }, {
            where: {
                id_despesa
            }
        });
        if (atualizarDespesa[0] === 0) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }

        res.json({ success: true, message: "Despesa rejeitada com sucesso." });
    } catch (error) {
        console.error("Erro ao rejeitar despesa:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao rejeitar despesa.",
            error: error.message
        });
    }
}
    */

module.exports = controller;
