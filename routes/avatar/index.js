//carregando modulos
const sql = require('mssql');
const express = require('express');
const router = express.Router();
const config = require('../../../config/config.json');
const { get } = require('../../../lib/poolManager')
const connection = require('../../../config/' + config.Sup-Dgitial);

//Aplica alteração no status da sanção apartir das ações do Acompanhamento de Sanções
router.get('/avatar/:id', async (req, res) => {
    try {
        const pool = await sql.connect(connection);
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('GetAvatarById');
        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Rota UPDATE para atualizar o avatar por ID
router.put('/avatar/:id', async (req, res) => {
    try {
        const pool = await sql.connect(connection);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('newAvatar', sql.NVarChar(255), req.body.avatar)
            .execute('UpdateAvatarById');
        res.send('Avatar atualizado com sucesso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});



module.exports = router