//carregando modulos
const sql = require('mssql');
const express = require('express');
const router = express.Router();
const config = require('../../../config/config.json');
const { get } = require('../../../lib/poolManager')
const connection = require('../../../config/' + config.Sup-Digital);

//Aplica alteração no status da sanção apartir das ações do Acompanhamento de Sanções
router.get('/', function (req, res) {
    const {
        almope,
    } = req.query

    if (!almope) {
        res.status(400).json('almope não informado.')
        return
    }


    retornaDados(almope,  res)
});

async function retornaDados(almope, res) {
    try {

        let pool = await get('BDRechamadasGeral', connection)
        // Requisição do banco
        let result = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            
            .execute('s_Monitoramento_Agentes_Retorna_Agentes_Supervisor')


        if (!result?.recordset) {
            res.status(500).json('Não foi possível retornar os dados.')
            return;
        }

        let retorno = result.recordset

        res.json(retorno)

    } catch (error) {
        res.status(500).json(error)
    }
}



module.exports = router