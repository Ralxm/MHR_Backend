const Candidaturas = require('../models/Candidaturas');
var sequelize = require('../models/database');
const nodemailer = require('nodemailer');
const config = require('../config');
const Utilizadores = require('../models/Utilizadores')
const Vaga = require('../models/Vaga')
const Perfis = require('../models/Perfis')
const Comentarios = require('../models/Comentarios')

const controller = {};

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

controller.candidaturasCreate = async function (req, res) {
    const { id_vaga, id_utilizador, telemovel, email, status } = req.body;

    const curriculo = req.file ? req.file.path : null;

    const data = await Candidaturas.create({
        id_vaga: id_vaga,
        id_utilizador: id_utilizador,
        data_submissao: getDate(),
        curriculo: curriculo,
        telemovel: telemovel,
        email: email,
        status: status,
        responsavel: 1,
        resultado: "Em análise",
        created_at: getDate(),
        updated_at: getDate()
    })
        .then(function (data) {
            res.status(200).json({
                success: true,
                message: "Candidatura criada",
                data: data
            })
        })
        .catch(error =>
            res.status(500).json({
                success: false,
                message: "Erro a criar a candidatura",
                error: error.message
            })
        )
}

controller.candidaturasList = async function (req, res) {
    try {
        const data = await Candidaturas.findAll({
            order: ['data_submissao'],
            include: [
                {
                    model: Utilizadores,
                    as: 'utilizador',
                    required: false
                }
            ],
        });

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as candidaturas",
            error: error.message
        });
    }
}

controller.candidaturasListPorVaga = async function (req, res) {
    const { id } = req.params;
    try {
        const data = await Candidaturas.findAll({
            include: [
                {
                    model: Utilizadores,
                    as: 'utilizador',
                    required: false
                }
            ],
            order: ['data_submissao'],
            where: { id_vaga: id }
        });

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as candidaturas",
            error: error.message
        });
    }
}
controller.candidaturasListPorUser = async function (req, res) {
    const { id } = req.params;
    try {
        const data = await Candidaturas.findAll({
            include: [
                {
                    model: Utilizadores,
                    as: 'utilizador',
                    required: false
                }
            ],
            order: ['data_submissao'],
            where: { id_utilizador: id }
        });

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as candidaturas",
            error: error.message
        });
    }
}

controller.candidaturasListAceites = async function (req, res) {
    try {
        const data = await Candidaturas.findAll({
            include: [
                {
                    model: Utilizadores,
                    as: 'utilizador',
                    required: false
                }
            ],
            order: ['data_submissao']
        },
            {
                where: { status: "Aceite" }
            });

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as candidaturas",
            error: error.message
        });
    }
}

controller.candidaturasListAnalise = async function (req, res) {
    try {
        const data = await Candidaturas.findAll({
            include: [
                {
                    model: Utilizadores,
                    as: 'utilizador',
                    required: false
                }
            ],
            order: ['data_submissao']
        },
            {
                where: { status: "Em análise" }
            });

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as candidaturas",
            error: error.message
        });
    }
}

controller.candidaturasListRejeitadas = async function (req, res) {
    try {
        const data = await Candidaturas.findAll({
            include: [
                {
                    model: Utilizadores,
                    as: 'utilizador',
                    required: false
                }
            ],
            order: ['data_submissao']
        },
            {
                where: { status: "Rejeitadas" }
            });

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as candidaturas",
            error: error.message
        });
    }
}

controller.candidaturasGet = async function (req, res) {
    const { id } = req.params;

    try {
        const data = await Candidaturas.findAll({
            include: [
                {
                    model: Utilizadores,
                    as: 'utilizador',
                    required: false
                }
            ],
            where: { id_candidatura: id }
        });

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao encontrar a candidatura",
            error: error.message
        });
    }
}

controller.candidaturasDelete = async function (req, res) {
    const { id } = req.params;
    try{
        await Comentarios.destroy({
            where: {id_candidatura: id}
        })

        await Candidaturas.destroy({
            where: { id_candidatura: id }
        })

        res.status(200).json({
            success: true,
            message: "Candidatura apagada com sucesso!"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a candidatura",
            error: error.message
        });
    }

    /*const data = await Candidaturas.destroy({
        where: { id_candidatura: id }
    })
        .then(function () {
            res.status(200).json({
                success: true,
                message: "Candidatura apagada com sucesso!"
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Erro a apagar a candidatura",
                error: error.message
            });
        })*/
}

controller.candidaturasUpdate = async function (req, res) {
    const { id } = req.params;
    const { telemovel, email, status, responsavel, resultado } = req.body;
    try {
        //Encontra o comentário que vamos atualizar
        const candidatura = await Candidaturas.findOne({ where: { id_candidatura: id } });

        //Se não encontrar o comentário responde com um erro
        if (!candidatura) {
            return res.status(404).json({
                success: false,
                message: "Candidatura não encontrada"
            });
        }

        //Esta parte do código verifica se o comentario já tem um ficheiro. Se sim, apaga-o e troca-o por um novo.
        //Se não for inserido nenhum ficheiro diferente/novo na atualização então o ficheiro anterior mantém-se
        let curriculo = candidatura.curriculo;
        if (req.file) {
            if (curriculo) {
                fs.unlinkSync(path.resolve(curriculo));
            }
            curriculo = req.file.path;
        }

        await Candidaturas.update({
            telemovel: telemovel,
            email: email,
            status: status,
            responsavel: responsavel,
            resultado: resultado,
            curriculo: curriculo,
            updated_at: getDate()
        }, {
            where: { id_candidatura: id }
        });

        res.status(200).json({
            success: true,
            message: "Candidatura atualizado com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar a candidatura",
            error: error.message
        });
    }
};

controller.candidaturasAceitar = async function (req, res) {
    try {
        const { id } = req.params;
        const { responsavel, resultado } = req.body;

        const candidatura = await Candidaturas.findOne({
            where: { id_candidatura: id }
        });

        if (!candidatura) {
            return res.status(404).json({
                success: false,
                message: "Candidatura não encontrada"
            });
        }

        await Candidaturas.update({
            status: "Aceite",
            responsavel: responsavel,
            resultado: resultado
        }, {
            where: { id_candidatura: id }
        });

        const vaga = await Vaga.findOne({
            where: { id_vaga: candidatura.id_vaga }
        });

        if (vaga) {
            if (vaga.numero_vagas_restantes === 1) {
                vaga.numero_vagas_restantes = 0;
                vaga.estado = "Ocupada";
                console.log("Alterei a vaga para ocupada");
            } else if (vaga.numero_vagas_restantes > 1) {
                vaga.numero_vagas_restantes -= 1;
                console.log("Diminui um valor do numero de vagas restantes");
            }

            vaga.changed('numero_vagas_restantes', true);
            vaga.changed('estado', true);

            await vaga.save();
            console.log("Está tudo feito");
        }

        /*const perfil = await Perfis.findOne({where: {id_utilizador: candidatura.id_utilizador}})
        const utilizador = await Utilizadores.findOne({where: {id_utilizador: candidatura.id_utilizador}})

        if(!perfil){
            await Perfis.create({
                id_departamento: 1,
                id_utilizador: candidatura.id_utilizador,
                nome: "",
                email: candidatura.email,
                morada: "",
                telemovel: candidatura.telemovel,
                data_nascimento: "01-01-1970",
                distrito: "",
                created_at: getDate(),
                updated_at: getDate()
            })

            if(utilizador){
                utilizador.id_tipo = 3;
                await utilizador.save();
            }
        }*/


        res.status(200).json({
            success: true,
            message: "Candidatura aceite com sucesso"
        });
    } catch (error) {
        console.error("Erro ao aceitar candidatura:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao aceitar a candidatura",
            error: error.message
        });
    }
};

controller.candidaturasAnalisar = async function (req, res) {
    const { id } = req.params;
    const data = await Candidaturas.update({
        status: "Em análise",
    }, {
        where: { id_candidatura: id }
    })
        .then(function () {
            res.status(200).json({
                success: true,
                message: "Candidatura alterada para em análise com sucesso"
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a editar a candidatura para 'em análise'",
                error: error.message
            });
        })
}


controller.candidaturasRejeitar = async function (req, res) {
    const { id } = req.params;
    const { responsavel, resultado } = req.body;
    const data = await Candidaturas.update({
        status: "Rejeitada",
        responsavel: responsavel,
        resultado: resultado
    }, {
        where: { id_candidatura: id }
    })
        .then(function () {
            res.status(200).json({
                success: true,
                message: "Candidatura rejeitada com sucesso"
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a rejeitar a candidatura",
                error: error.message
            });
        })
}

controller.candidaturasUpdatePorUser = async function (req, res) {
    const { id } = req.params;
    const { telemovel, email } = req.body;
    try {
        //Encontra o comentário que vamos atualizar
        const candidatura = await Candidaturas.findOne({ where: { id_candidatura: id } });

        //Se não encontrar o comentário responde com um erro
        if (!candidatura) {
            return res.status(404).json({
                success: false,
                message: "Candidatura não encontrada"
            });
        }

        //Esta parte do código verifica se o comentario já tem um ficheiro. Se sim, apaga-o e troca-o por um novo.
        //Se não for inserido nenhum ficheiro diferente/novo na atualização então o ficheiro anterior mantém-se
        let curriculo = candidatura.curriculo;
        if (req.file) {
            if (curriculo) {
                fs.unlinkSync(path.resolve(curriculo));
            }
            curriculo = req.file.path;
        }

        await Candidaturas.update({
            telemovel: telemovel,
            email: email,
            curriculo: curriculo,
            updated_at: getDate()
        }, {
            where: { id_candidatura: id }
        });

        res.status(200).json({
            success: true,
            message: "Candidatura atualizado com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar a candidatura",
            error: error.message
        });
    }
};


/*controllers.upload_file = async (req, res) => {
    const { id_vaga, nome_candidato, informacoes_contacto } = req.body;
    const curriculo = req.file ? req.file.path : null;

    try {

        if (!curriculo) {
            return res.status(400).json({ success: false, message: "Faltam dados necessários!" });
        }


        const data = await Candidaturas.create({
            id_vaga: id_vaga,
            curriculo: curriculo,
            status: "A aguardar análise",
            data_submissao: new Date(),
            informacoes_contacto: informacoes_contacto,
            nome_candidato: nome_candidato
        });

        return res.status(201).json({ success: true, message: "Candidatura Submetida com Sucesso!", data: data });
    } catch (error) {
        console.error('Erro ao criar candidatura:', error);
        return res.status(500).json({ success: false, message: "Erro ao submeter ficheiro.", error: error.message });
    }
};


controllers.download_file = async (req, res) => {
    const { id } = req.params;

    try {
        const candidatura = await Candidaturas.findOne({ where: { id_candidatura: id } });

        if (!candidatura) {
            return res.status(404).json({ success: false, message: "Ficheiro não encontrado!" });
        }

        const file = candidatura.curriculo;
        res.download(file, (err) => {
            if (err) {
                res.status(500).json({ success: false, message: "Erro ao descarregar o ficheiro!" });
            } else {
                res.status(200).json({ success: true, message: "Ficheiro descarregado com sucesso!" });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: `Erro ao buscar candidatura: ${error.message}` });
    }
}

controllers.candidatura_criar_userVisitante = async (req, res) => {
    const { id_vaga, email, nome_candidato } = req.body;
    const curriculo = req.file ? req.file.path : null;

    try {
        if (!id_vaga || !curriculo) {
            return res.status(400).json({ success: false, message: "Faltam dados necessários!" });
        }

        const data = await Candidaturas.create({
            id_vaga: id_vaga,
            curriculo: curriculo,
            status: "A aguardar análise",
            data_submissao: new Date(),
            informacoes_contacto: email,
            nome_candidato: nome_candidato
        });

        const tempPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);


        await userVisitante.create({
            email: email,
            pass: hashedPassword,
            nome_utilizador: nome_candidato,
        });

        const transporter = nodemailer.createTransport({
            service: 'Outlook',
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: config.EMAIL_USER,
            to: email,
            subject: 'Credenciais Temporárias para Acesso ao Sistema',
            text: `Olá ${nome_candidato},

Obrigado por se candidatar à vaga.

Para poder ter acesso ao estado da sua candidatura, aqui estão as suas credenciais temporárias:

Utilizador: ${email}
Senha: ${tempPassword}

Atenciosamente,
Equipa Vision4You`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: "Candidatura Submetida com Sucesso! Verifique seu e-mail para as credenciais de login temporário.", data: data });
    } catch (error) {
        console.error('Erro ao criar candidatura ou enviar e-mail:', error);
        return res.status(500).json({ success: false, message: "Erro ao submeter ficheiro.", error: error.message });
    }
};

controllers.candidaturas_lista = async (req, res) => {
    try {
        const { id_vaga } = req.params;
        const candidaturas = await Candidaturas.findAll({ where: { id_vaga } });

        const candidaturasComInfo = await Promise.all(
            candidaturas.map(async (candidatura) => {
                const autor = await User.findOne({ where: { email: candidatura.informacoes_contacto } });
                const vaga = await Vaga.findOne({ where: { id_vaga: candidatura.id_vaga } });
                return {
                    ...candidatura.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor',
                    titulo_vaga: vaga ? vaga.titulo_vaga : 'Sem vaga',
                    descricao: vaga ? vaga.descricao : 'Sem vaga',
                    requisitos: vaga ? vaga.requisitos : 'Sem vaga'
                };
            })
        );
        res.json({ success: true, candidaturasComInfo });
    }
    catch (error) {
        console.error('Erro ao procurar candidaturas:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar candidaturas' });
    }
}



controllers.numero_candidaturas_vaga = async (req, res) => {
    try {
        const totalCandidatos = await Candidaturas.count({ where: { id_vaga: req.params.id_vaga } });
        res.json({ success: true, totalCandidatos: totalCandidatos });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

controllers.candidatura_apagar = async (req, res) => {
    const { id_candidatura } = req.body;
    const data = await Candidaturas.destroy({ where: { id_candidatura: id_candidatura } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Candidatura apagada com sucesso!",
        data: data
    });
}

controllers.candidatura_atualizar = async (req, res) => {
    const { id_candidatura, id_vaga, id_user, data_submissao, estado } = req.body;
    const data = await Candidaturas.update({
        id_vaga: id_vaga,
        id_user: id_user,
        data_submissao: data_submissao,
        estado: estado
    }, {
        where: { id_candidatura: id_candidatura }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Candidatura atualizada com sucesso!",
        data: data
    });
}

controllers.candidatura_detalhes = async (req, res) => {
    const { id } = req.params;
    const data = await Candidaturas.findOne({ where: { id_candidatura: id } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}


controllers.candidaturas_lista_user = async (req, res) => {
    try {
        const { id_user } = req.params;

        const user = await User.findOne({ where: { id_user } });


        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado!" });
        }

        const candidaturaUser = await Candidaturas.findAll({ where: { informacoes_contacto: user.email.trim() } });

        const dadosCandidatura = await Promise.all(
            candidaturaUser.map(async (candidatura) => {
                const user = await User.findOne({ where: { email: candidatura.informacoes_contacto } });
                const vaga = await Vaga.findOne({ where: { id_vaga: candidatura.id_vaga } });
                return {
                    ...candidatura.toJSON(),
                    autor: user ? user.nome_utilizador : 'Desconhecido',
                    titulo_vaga: vaga ? vaga.titulo_vaga : 'Desconhecido'
                };
            })
        );

        res.json({ success: true, dadosCandidatura });
    } catch (error) {
        console.error('Erro ao processar candidaturas do utilizador:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.candidaturas_lista_user_visitante = async (req, res) => {
    try {
        const { id_user_visitante } = req.params;

        const user = await userVisitante.findOne({ where: { id_user_visitante } });


        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado!" });
        }

        const candidaturaUser = await Candidaturas.findAll({ where: { informacoes_contacto: user.email} });

        const dadosCandidaturaVisitante = await Promise.all(
            candidaturaUser.map(async (candidatura) => {
                const user = await userVisitante.findOne({ where: { email: candidatura.informacoes_contacto } });
                const vaga = await Vaga.findOne({ where: { id_vaga: candidatura.id_vaga } });
                return {
                    ...candidatura.toJSON(),
                    autor: user ? user.nome_utilizador : 'Desconhecido',
                    titulo_vaga: vaga ? vaga.titulo_vaga : 'Desconhecido'
                };
            })
        );

        console.log(dadosCandidaturaVisitante);
        res.json({ success: true, dadosCandidaturaVisitante });
    } catch (error) {
        console.error('Erro ao processar candidaturas do utilizador:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}
*/


module.exports = controller;
