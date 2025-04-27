const Ideia = require('../models/Ideia');
var sequelize = require('../models/database');
const Perfis = require('../models/Perfis')

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

controller.ideiaCreate = async function (req, res){
    const { id_perfil, titulo_ideia, descricao, estado} = req.body;
    const ficheiro_complementar = req.file ? req.file.path : null;

    const data = await Ideia.create({
        id_perfil: id_perfil,
        titulo_ideia: titulo_ideia,
        descricao: descricao,
        estado: estado,
        ficheiro_complementar: ficheiro_complementar,
        validador: null,
        created_at: getDate(),
        updated_at: getDate()
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Ideia criada",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar a ideia",
            error: error.message
        })
    )
}

controller.ideiaList = async function (req, res){
    try {
        const data = await Ideia.findAll({
            order: ['titulo_ideia'],
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
            ],
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            ficheiro_complementar: item.ficheiro_complementar ? `${req.protocol}://${req.get('host')}/${item.ficheiro_complementar}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as ideias",
            error: error.message
        });
    }
}

controller.ideiaList_EmAnalise = async function (req, res){
    try {
        const data = await Ideia.findAll({
            order: ['titulo_ideia'],
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
            ],
            where: {estado: "Em análise"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            ficheiro_complementar: item.ficheiro_complementar ? `${req.protocol}://${req.get('host')}/${item.ficheiro_complementar}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as ideias",
            error: error.message
        });
    }
}

controller.ideiaList_Aprovada = async function (req, res){
    const data = await Ideia.findAll({
        order: ['titulo_projeto'],
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
            {
                model: Perfis,
                as: 'validadorPerfil',
                required: false
            },
        ],
        where: {estado: "Aprovada"},
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os Projetos",
            error: error.message
        });
    });
}

controller.ideiaList_Rejeitada = async function (req, res){
    try {
        const data = await Ideia.findAll({
            order: ['titulo_ideia'],
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
            ],
            where: {estado: "Rejeitada"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            ficheiro_complementar: item.ficheiro_complementar ? `${req.protocol}://${req.get('host')}/${item.ficheiro_complementar}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as ideias",
            error: error.message
        });
    }
}

controller.ideiaListUser = async function (req, res){
    const { id } = req.params;
    try {
        const data = await Ideia.findAll({
            order: ['titulo_ideia'],
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
            ],
            where: {id_perfil: id}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            ficheiro_complementar: item.ficheiro_complementar ? `${req.protocol}://${req.get('host')}/${item.ficheiro_complementar}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as ideias",
            error: error.message
        });
    }
}

controller.ideiaGet = async function (req, res){
    const { id } = req.params;

    try {
        const data = await Ideia.findAll({
            where: { id_ideia: id },
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
            ],
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            ficheiro_complementar: item.ficheiro_complementar ? `${req.protocol}://${req.get('host')}/${item.ficheiro_complementar}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao encontrar a ideia",
            error: error.message
        });
    }
}

controller.ideiaDelete = async function (req, res){
    const { id } = req.params;
    const data = await Ideia.destroy({
        where: {id_ideia: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Ideia apagada com sucesso"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o Projeto",
            error: error.message
        });
    })
}

controller.ideiaUpdate = async function (req, res){
    const { id } = req.params;
    const { titulo_ideia, descricao, estado, validador } = req.body;

    const toNullIfStringNull = (value) => (value === "null" || value === "undefined") ? null : value;

    try {
        //Encontra a ideia que vamos atualizar
        const ideia = await Ideia.findOne({
            where: { id_ideia: id }
        });

        //Se não encontrar o comentário responde com um erro
        if (!ideia) {
            return res.status(404).json({
                success: false,
                message: "Ideia não encontrada"
            });
        }

        //Esta parte do código verifica se o comentario já tem um ficheiro. Se sim, apaga-o e troca-o por um novo.
        //Se não for inserido nenhum ficheiro diferente/novo na atualização então o ficheiro anterior mantém-se
        let ficheiro_complementar = ideia.ficheiro_complementar;
        if (req.file) {
            if (ficheiro_complementar) {
                fs.unlinkSync(path.resolve(ficheiro_complementar));
            }
            ficheiro_complementar = req.file.path;
        }

        await Ideia.update({
            titulo_ideia: titulo_ideia,
            descricao: descricao,
            estado: estado,
            ficheiro_complementar: ficheiro_complementar,
            validador: toNullIfStringNull(validador),
            updated_at: getDate()
        }, {
            where: { id_ideia: id }
        });

        res.status(200).json({
            success: true,
            message: "Ideia atualizada com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar a ideia",
            error: error.message
        });
    }
}

controller.aceitarIdeia = async function (req, res){
    const { id } = req.params;

    try {
        //Encontra a ideia que vamos atualizar
        const ideia = await Ideia.findOne({
            where: { id_ideia: id }
        });

        //Se não encontrar o comentário responde com um erro
        if (!ideia) {
            return res.status(404).json({
                success: false,
                message: "Ideia não encontrada"
            });
        }

        await Ideia.update({
            estado: "Aceite",
            updated_at: getDate()
        }, {
            where: { id_ideia: id }
        });

        res.status(200).json({
            success: true,
            message: "Ideia aceite com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao aceitar a ideia",
            error: error.message
        });
    }
}

controller.rejeitarIdeia = async function (req, res){
    const { id } = req.params;

    try {
        //Encontra a ideia que vamos atualizar
        const ideia = await Ideia.findOne({
            where: { id_ideia: id }
        });

        //Se não encontrar o comentário responde com um erro
        if (!ideia) {
            return res.status(404).json({
                success: false,
                message: "Ideia não encontrada"
            });
        }

        await Ideia.update({
            estado: "Rejeitada",
            updated_at: getDate()
        }, {
            where: { id_ideia: id }
        });

        res.status(200).json({
            success: true,
            message: "Ideia rejeitada com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao rejeitar a ideia",
            error: error.message
        });
    }
}



/*controllers.adicionar_ideia = async (req, res) => {

    const { id_user, titulo_ideia, descricao } = req.body;
    const ficheiro_complementar = req.file ? req.file.path : null;

    try {
        const ideias = await Ideias.create({
            id_user: id_user,
            titulo_ideia: titulo_ideia,
            descricao: descricao,
            ficheiro_complementar: ficheiro_complementar,
            data_criacao: new Date(),
            estado: 'Em estudo'
        });

        res.json({ success: true, ideias });
    } catch (error) {
        console.log(error);
    }
};

controllers.download_file = async (req, res) => {
    const { ficheiro_complementar } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', 'files', ficheiro_complementar);

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao transferir ficheiro', error: err });
        }
    });
}

controllers.ideias_lista = async (req, res) => {
    try {
        const ideias = await Ideias.findAll({ where: { estado: ['Aprovada', 'Rejeitada'] } });
        const ideiasComAutores = await Promise.all(
            ideias.map(async (ideia) => {
                const user = await User.findOne({ where: { id_user: ideia.id_user } });
                return {
                    ...ideia.toJSON(),
                    autor: user ? user.nome_utilizador : 'Desconhecido'
                };
            })
        );

        res.json({
            success: true,
            ideias: ideiasComAutores,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.ideias_lista_em_estudo = async (req, res) => {
    try {
        const ideias = await Ideias.findAll({ where: { estado: 'Em estudo' } });
        const ideiasComAutores = await Promise.all(
            ideias.map(async (ideia) => {
                const user = await User.findOne({ where: { id_user: ideia.id_user } });
                return {
                    ...ideia.toJSON(),
                    autor: user ? user.nome_utilizador : 'Desconhecido'
                };
            })
        );

        res.json({
            success: true,
            ideias: ideiasComAutores,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.ideias_lista_user = async (req, res) => {
    const { id_user } = req.params;

    try {
        const ideias = await Ideias.findAll({ where: { id_user } });

        res.json({ success: true, ideias });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.ideias_reformular = async (req, res) => {
    const { id_ideia } = req.params;
    const {id_user, titulo_ideia, descricao } = req.body;
    const ficheiro_complementar = req.file ? req.file.path : null;

    try {
        const ideia = await Ideias.findOne({ where: { id_ideia } });

        if (!ideia) {
            return res.status(404).json({
                success: false,
                message: "Ideia não encontrada"
            });
        }

        if (ideia.ficheiro_complementar) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'files', ideia.ficheiro_complementar);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await Ideias.update({
            titulo_ideia: titulo_ideia,
            descricao: descricao,
            ficheiro_complementar: ficheiro_complementar || ideia.ficheiro_complementar,
            estado: 'Em estudo',
            id_user: id_user
        }, {
            where: { id_ideia }
        });

        const updatedIdeia = await Ideias.findOne({ where: { id_ideia } });

        res.status(200).json({
            success: true,
            message: "Ideia atualizada com sucesso!",
            updatedIdeia
        });
    } catch (error) {
        console.error('Erro ao atualizar ideia:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar ideia',
            error: error.message 
        });
    }
}

controllers.ideias_detalhes = async (req, res) => {
    const { id_ideia } = req.params;
    const data = await Ideias.findAll({
        where: {
            id_ideia: id_ideia
        }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}

controllers.ideias_atualizar = async (req, res) => {
    const { id_ideia } = req.params;
    const { titulo_ideia, descricao } = req.body;
    const ficheiro_complementar = req.file ? req.file.path : null;

    try {
        const ideia = await Ideias.findOne({ where: { id_ideia } });

        if (!ideia) {
            return res.status(404).json({
                success: false,
                message: "Ideia não encontrada"
            });
        }

        if (ideia.ficheiro_complementar) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'files', ideia.ficheiro_complementar);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await Ideias.update({
            titulo_ideia: titulo_ideia,
            descricao: descricao,
            ficheiro_complementar: ficheiro_complementar || ideia.ficheiro_complementar
        }, {
            where: { id_ideia }
        });

        const updatedIdeia = await Ideias.findOne({ where: { id_ideia } });

        res.status(200).json({
            success: true,
            message: "Ideia atualizada com sucesso!",
            updatedIdeia
        });
    } catch (error) {
        console.error('Erro ao atualizar ideia:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar ideia',
            error: error.message 
        });
    }
}

controllers.aprovar_ideia = async (req, res) => {
    try {
        const { id_ideia } = req.params;
        const { validador, data_conclusao, data_inicio} = req.body;
        let imagem = req.file ? req.file.filename : 'public/img/background.jpg';
        const atualizarIdeia = await Ideias.update(
            {
                validador: validador,
                estado: "Aprovada"
            }, {
            where: { id_ideia }
        });
        if (atualizarIdeia[0] === 0) {
            return res.status(404).json({ success: false, message: "Ideia não encontrada." });
        }

        const ideia = await Ideias.findOne({ where: { id_ideia } });

        if (!ideia) {
            return res.status(404).json({ success: false, message: "Ideia não encontrada." });
        }

        const projetoCriado = await Projetos.create(
            {
                titulo_projeto: ideia.titulo_ideia,
                descricao: ideia.descricao,
                estado: "Em desenvolvimento",
                imagem: imagem,
                data_criacao: new Date(),
                data_atribuicao: new Date(),
                data_final_prevista: data_conclusao,
                data_inicio:data_inicio,
            }
        );
        const users = await User.findAll();

        const userAleatorio = users[Math.floor(Math.random() * users.length)];

        if (!userAleatorio) {
            return res.status(400).json({
                success: false,
                message: "Nenhum utilizador disponível para atribuição",
            });
        }

        await Projetos.update({ responsavel: userAleatorio.nome_utilizador }, { where: { id_projeto: projetoCriado.id_projeto } });




        await Ideias.update(
            {
                id_projeto: projetoCriado.id_projeto
            }, {
            where: { id_ideia }
        });

        res.status(200).json({
            success: true,
            message: "Projeto adicionado com sucesso!",
            projetoCriado,
        });
    } catch (error) {
        console.error('Erro ao aprovar ideia:', error);
        res.status(500).json({ success: false, message: 'Erro ao aprovar ideia', error });
    }
};


controllers.rejeitar_ideia = async (req, res) => {
    const { id_ideia } = req.params;
    const { comentarios, validador } = req.body;

    const data = await Ideias.update({
        estado: 'Rejeitada',
        validador: validador,
        comentarios: comentarios
    }, {
        where: {
            id_ideia: id_ideia
        }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}
*/
module.exports = controller;