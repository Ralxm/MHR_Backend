const Projetos = require('../models/Projetos');
var sequelize = require('../models/database');
const controller = {};

sequelize.sync();

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

controller.projetoCreate = async function (req, res){
    const { id_ideia, titulo_projeto, estado, data_atribuicao, descricao, objetivos, data_inicio, data_final_prevista } = req.body;
    const data = await Projetos.create({
        id_ideia: id_ideia,
        titulo_projeto: titulo_projeto,
        estado: estado,
        data_atribuicao: data_atribuicao,
        descricao: descricao,
        objetivos: objetivos,
        data_inicio: data_inicio,
        data_final_prevista: data_final_prevista,
        created_at: getDate(),
        updated_at: getDate()
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Projeto criado",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar o Projeto",
            error: error.message
        })
    )
}

controller.projetoList = async function (req, res){
    const data = await Projetos.findAll({order: ['titulo_projeto']})
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

controller.projetoList_EmDesenvolvimento = async function (req, res){
    const data = await Projetos.findAll({order: ['titulo_projeto']},
        {
            where: {estado: "Em desenvolvimento"}
        }
    )
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

controller.projetoList_Concluidos = async function (req, res){
    const data = await Projetos.findAll({order: ['titulo_projeto']},
        {
            where: {estado: "Concluído"}
        }
    )
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

controller.projetoGet = async function (req, res){
    const { id } = req.params;
    const data = await Projetos.findAll({
        where: { id_projeto: id }
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
            message: "Erro a encontrar o Projeto",
            error: error
        });
    })
}

controller.projetoDelete = async function (req, res){
    const { id } = req.params;
    const data = await Projetos.destroy({
        where: {id_projeto: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Projeto apagado"
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

controller.projetoUpdate = async function (req, res){
    const { id } = req.params;
    const { id_ideia, titulo_projeto, estado, data_atribuicao, descricao, objetivos, data_inicio, data_final_prevista } = req.body;
    const data = await Projetos.update({
        id_ideia: id_ideia,
        titulo_projeto: titulo_projeto,
        estado: estado,
        data_atribuicao: data_atribuicao,
        descricao: descricao,
        objetivos: objetivos,
        data_inicio: data_inicio,
        data_final_prevista: data_final_prevista,
        updated_at: getDate()
    },{
        where: {id_utilizador: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "AuditLog Projeto"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a atualizar o Projeto",
            error: error.message
        });
    })
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*controllers.projetos_lista = async (req, res) => {
    try {
        const projetos = await Projetos.findAll();

        res.json({ success: true,  projetos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.projetos_lista_em_desenvolvimento = async (req, res) => {
    try {
        const projetos = await Projetos.findAll({ where: { estado: "Em desenvolvimento" } })

        res.json({ success: true, projetos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.projetos_lista_desenvolvidos = async (req, res) => {
    try {
        const projetos = await Projetos.findAll({ where: { estado: "Concluído" } })

        res.json({ success: true, projetos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


controllers.projetos_adicionar = async (req, res) => {
    const { titulo_projeto, descricao, objetivos, data_inicio, data_final_prevista } = req.body;
    let imagem = req.file ? req.file.filename : 'public/img/background.jpg';
    try {
        const objetivosArray = Array.isArray(objetivos) ? objetivos : JSON.parse(objetivos || '[]');
        
        const objetivosFormato = objetivosArray.map(objetivo => ({
            descricao: typeof objetivo === 'string' ? objetivo : objetivo.descricao,
            data_criacao: new Date(),
            concluido: false,
        }));
  
        const projeto = await Projetos.create({
            imagem: imagem,
            titulo_projeto: titulo_projeto,
            descricao: descricao,
            objetivos: objetivosFormato,
            data_inicio: data_inicio,
            data_final_prevista: data_final_prevista,
            estado: "Em desenvolvimento",
            data_criacao: new Date(),
            data_atribuicao: new Date(),
        });

        const users = await User.findAll();
        
        const userAleatorio = users[Math.floor(Math.random() * users.length)];

        if (!userAleatorio) {
            return res.status(400).json({
                success: false,
                message: "Nenhum utilizador disponível para atribuição",
            });
        }

        await projeto.update({ responsavel: userAleatorio.nome_utilizador });

        res.status(200).json({
            success: true,
            message: "Projeto adicionado com sucesso!",
            projeto, 
        });

    } catch (error) {
        console.error('Erro ao adicionar projeto:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao adicionar projeto",
            error: error.message,
        });
    }
};

controllers.projetos_comentarios = async (req, res) => {
    const { id_projeto } = req.params;
    const { comentarios } = req.body;

    try {
        const projeto = await Projetos.findOne({ where: { id_projeto } });

        if (!projeto) {
            return res.status(404).json({ success: false, message: "Projeto não encontrado" });
        }

        const comentariosExistentes = projeto.comentarios || [];
        const comentariosArray = Array.isArray(comentarios) ? comentarios : JSON.parse(comentarios || '[]');

        const novosComentarios = comentariosArray.map(comentario => ({
            descricao: typeof comentario === 'string' ? comentario : comentario.descricao,
            data_criacao: new Date(),
            autor_comentario: comentario.autor_comentario,
        }));

        const comentariosAtualizados = [...comentariosExistentes, ...novosComentarios];

        await projeto.update({ comentarios: comentariosAtualizados });

        return res.status(200).json({
            success: true,
            message: "Comentários adicionados com sucesso!",
            projeto,
        });
    } catch (error) {
        console.error('Erro ao adicionar comentários:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao adicionar comentários",
            error: error.message,
        });
    }
};


controllers.projetos_pontosBloqueio = async (req, res) => {
    const { id_projeto } = req.params;
    const { pontosBloqueio } = req.body;

    try {
        const projeto = await Projetos.findOne({ where: {id_projeto } }); 

        if (!projeto) {
            return res.status(404).json({ success: false, message: "Projeto não encontrado" });
        }

        const pontosBloqueioExistentes = projeto.pontosBloqueio || []; 
        const pontosBloqueioArray = Array.isArray(pontosBloqueio) ? pontosBloqueio : JSON.parse(pontosBloqueio || '[]');

        const novosPontosBloqueio = pontosBloqueioArray.map(ponto => ({
            descricao: typeof ponto === 'string' ? ponto : ponto.descricao,
            data_criacao: new Date(),
            data_resolucao: null,
            autor_pontoBloqueio: ponto.autor_pontoBloqueio,
            concluido: false,
        }));

        const pontosBloqueioAtualizados = [...pontosBloqueioExistentes, ...novosPontosBloqueio];

        await projeto.update({ pontosBloqueio: pontosBloqueioAtualizados });

        return res.status(200).json({
            success: true,
            message: "Pontos de bloqueio adicionados com sucesso!",
            projeto,
        });
    } catch (error) {
        console.error('Erro ao adicionar pontos de bloqueio:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao adicionar pontos de bloqueio",
            error: error.message,
        });
    }
};



controllers.projetos_apagar = async (req, res) => {
    const { id_projeto } = req.body;
    const data = await Projetos.destroy({ where: { id_projeto: id_projeto } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Projeto apagada com sucesso!",
        data: data
    });
}

controllers.projetos_editar = async (req, res) => {
    const {id_projeto} = req.params;
    const {  titulo_projeto, descricao, objetivos, data_inicio, data_final_prevista } = req.body;

    if (!id_projeto) {
        return res.status(400).json({ success: false, message: "ID do projeto é obrigatório" });
    }

    try {
        const projeto = await Projetos.update(
            {
                titulo_projeto: titulo_projeto,
                descricao: descricao,
                objetivos: objetivos, 
                data_inicio: data_inicio,
                data_final_prevista: data_final_prevista
            },
            {
                where: { id_projeto }
            }
        );

        if (projeto) {
            const projetoAtualizado = await Projetos.findOne({ where: { id_projeto } });
            return res.status(200).json({
                success: true,
                message: "Projeto atualizado com sucesso!",
                projetoAtualizado
            });
        } else {
            return res.status(404).json({ success: false, message: "Projeto não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao tentar atualizar o projeto!",
            error: error.message
        });
    }
};

controllers.projetos_detalhes = async (req, res) => {
    const { id_projeto } = req.params;

    try {
        const projeto = await Projetos.findOne({ where: { id_projeto } });

        if (projeto) {
            return res.status(200).json({
                success: true,
                projeto
            });
        } else {
            return res.status(404).json({ success: false, message: "Projeto não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao obter projeto:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao tentar obter projeto!",
            error: error.message
        });
    }
};



controllers.projetos_adicionar_desenvolvedor = async (req, res) => {
    const { id_projeto } = req.params;
    const { desenvolvedores } = req.body; 

    
    try {
        const projeto = await Projetos.findOne({ where: { id_projeto } });

        if (!projeto) {
            return res.status(404).json({ success: false, message: "Projeto não encontrado" });
        }
        const desenvolvedoresAtuais = projeto.desenvolvedores || [];

        const novosDesenvolvedores = desenvolvedores.filter(dev => !desenvolvedoresAtuais.includes(dev));

        const desenvolvedoresAtualizados = Array.from(new Set([...desenvolvedoresAtuais, ...novosDesenvolvedores]));

        await projeto.update({ desenvolvedores: desenvolvedoresAtualizados  });

        return res.status(200).json({
            success: true,
            message: "Desenvolvedores atualizados com sucesso!",
            projeto,
        });
    } catch (error) {
        console.error('Erro ao adicionar desenvolvedores:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao adicionar desenvolvedores",
            error: error.message,
        });
    }
};


controllers.projetos_lista_user_projetos_atuais = async (req, res) => {
    const { id_user } = req.params;

    try {
        const user = await User.findOne({ where: { id_user } }); 

        if (!user) {
            return res.status(404).json({ success: false, message: "utilizador não encontrado" });
        }

        const projetos = await Projetos.findAll({
            where: {
                [Op.or]: [
                    { responsavel: user.nome_utilizador },
                    { desenvolvedores: { [Op.contains]: [user.nome_utilizador] } } 
                ],
                estado: 'Em desenvolvimento' 
            }
        });

        if (projetos.length > 0) {
            return res.status(200).json({
                success: true,
                projetos
            });
        } else {
            console.log("Nenhum projeto encontrado");
            return res.status(404).json({ success: false, message: "Nenhum projeto encontrado para este utilizador" });
        }
    } catch (error) {
        console.error("Erro ao obter projetos:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao tentar obter projetos!",
            error: error.message
        });
    }
}

controllers.projetos_lista_user_projetos_concluidos = async (req, res) => {
    const { id_user } = req.params;

    try {

        const user = await User.findOne({ where: { id_user } }); 

        if (!user) {
            console.log("utilizador não encontrado");
            return res.status(404).json({ success: false, message: "utilizador não encontrado" });
        }

        const projetos = await Projetos.findAll({
            where: {
                [Op.or]: [
                    { responsavel: user.nome_utilizador },
                    { desenvolvedores: { [Op.contains]: [user.nome_utilizador] } } 
                ],
                estado: 'Concluído' 
            }
        });

        if (projetos.length > 0) {
            return res.status(200).json({
                success: true,
                projetos
            });
        } else {
            console.log("Nenhum projeto encontrado");
            return res.status(404).json({ success: false, message: "Nenhum projeto encontrado para este utilizador" });
        }
    } catch (error) {
        console.error("Erro ao obter projetos:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao tentar obter projetos!",
            error: error.message
        });
    }
}

controllers.projetos_lista_user = async (req, res) => {
    const { id_user } = req.params;

    try {
        console.log(`Buscando projetos para o utilizador com ID: ${id_user}`);

        const user = await User.findOne({ where: { id_user } }); 

        if (!user) {
            console.log("utilizador não encontrado");
            return res.status(404).json({ success: false, message: "utilizador não encontrado" });
        }

        const projetos = await Projetos.findAll({
            where: {
                [Op.or]: [
                    { responsavel: user.nome_utilizador },
                    { desenvolvedores: { [Op.contains]: [user.nome_utilizador] } } 
                ],
                estado: 'Em desenvolvimento'
            }
        });

        if (projetos.length > 0) {
            return res.status(200).json({
                success: true,
                projetos
            });
        } else {
            console.log("Nenhum projeto encontrado");
            return res.status(404).json({ success: false, message: "Nenhum projeto encontrado para este utilizador" });
        }
    } catch (error) {
        console.error("Erro ao obter projetos:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao tentar obter projetos!",
            error: error.message
        });
    }
};


controllers.projetos_concluirObjetivos = async (req, res) => {
    const { id_projeto } = req.params;
    const { objetivos } = req.body;

    try {
        const projeto = await Projetos.findOne({ where: { id_projeto } });

        if (!projeto) {
            return res.status(404).json({ success: false, message: "Projeto não encontrado" });
        }

        const objetivosExistentes = projeto.objetivos || [];
        const objetivosArray = Array.isArray(objetivos) ? objetivos : JSON.parse(objetivos || '[]');

        const objetivosAtualizados = objetivosExistentes.map(objetivo => {
            const objetivoConcluido = objetivosArray.find(obj => obj.id === objetivo.id);
            if (objetivoConcluido) {
                return { 
                    ...objetivo, 
                    concluido: true, 
                    data_conclusao: new Date() 
                };
            }
            return objetivo;
        });

        await projeto.update({ objetivos: objetivosAtualizados });

        return res.status(200).json({
            success: true,
            message: "Objetivos concluídos com sucesso!",
            projeto,
        });
    } catch (error) {
        console.error('Erro ao concluir objetivos:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao concluir objetivos",
            error: error.message,
        });
    }
}
controllers.projetos_concluirProjeto = async (req, res) => {
    const { id_projeto } = req.params;

    try {
        const projeto = await Projetos.findOne({ where: { id_projeto } });

        if (!projeto) {
            return res.status(404).json({ success: false, message: "Projeto não encontrado" });
        }

        await projeto.update({ estado: "Concluído", data_conclusao: new Date() });

        return res.status(200).json({
            success: true,
            message: "Projeto concluído com sucesso!",
            projeto,
        });
    } catch (error) {
        console.error('Erro ao concluir projeto:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao concluir projeto",
            error: error.message,
        });
    }
}

controllers.projetos_concluirPontosBloqueio = async (req, res) => {
    const { id_projeto } = req.params;
    const { pontosBloqueio } = req.body;

    try {
        const projeto = await Projetos.findOne({ where: { id_projeto } });

        if (!projeto) {
            return res.status(404).json({ success: false, message: "Projeto não encontrado" });
        }

        const pontosBloqueioExistentes = projeto.pontosBloqueio || [];
        const pontosBloqueioArray = Array.isArray(pontosBloqueio) ? pontosBloqueio : JSON.parse(pontosBloqueio || '[]');

        const pontosBloqueioAtualizados = pontosBloqueioExistentes.map(ponto => {
            const pontoConcluido = pontosBloqueioArray.find(p => p.descricao === ponto.descricao);
            if (pontoConcluido) {
                return { ...ponto, data_resolucao: new Date() };
            }
            return ponto;
        });

        await projeto.update({ pontosBloqueio: pontosBloqueioAtualizados });

        return res.status(200).json({
            success: true,
            message: "Pontos de bloqueio concluídos com sucesso!",
            projeto,
        });
    } catch (error) {
        console.error('Erro ao concluir pontos de bloqueio:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao concluir pontos de bloqueio",
            error: error.message,
        });
    }
}

*/

module.exports = controller;