const cron = require('node-cron');
const { atualizarEstadoVagas } = require('./controllers/vagaController');

cron.schedule('0 0 * * *', async () => {
    try {
        await atualizarEstadoVagas();
    } catch (error) {
        console.error('Erro ao atualizar:', error);
    }
});