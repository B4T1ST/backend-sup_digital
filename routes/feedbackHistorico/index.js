const sql = require('mssql');
const express = require('express');
const router = express.Router();
const config = require('../../config/config.json');
const connection = require('../../config/' + config.banco);
const { get } = require('../../lib/poolManager')

//rota para retornar agentes
router.get('/agentes', function (req, res) {
    
    retornaDadosAgente(res)
});

async function retornaDadosAgente(res) {
    try {

        let pool = await get('BDGamification', connection)
        // Requisição do banco
        let result = await pool.request()
            //define os parametros
            .execute('s_Sup_Digital_Login_Retorna_Agentes')

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

// rota de historico
router.get('/', function (req, res) {

    const{
        almope,
        dataInicio,
        dataFim,
    } = req.query

    retornaDados(almope, dataInicio, dataFim, res)
});

/*router.get('/extracaoXlsx', function (req, res) {
    
    const {
        almope,
        dataInicial,
        dataFinal,
        cComparativo
    } = req.query

    if (!almope) {
        res.status(400).json('almope não informado.')
        return
    }

    if (!cComparativo) {
        res.status(400).json('cComparativo não informado')
        return
    }

    retornaDadosExtracao(almope, dataInicial, dataFinal, cComparativo, res)
});
*/
async function retornaDados(almope, dataInicio, dataFim, res){
    try {
        let pool = await get('BDGamification', connection);
        console.log('Procedura retorna historico primeira request');

        // Requisição do banco
        let resultFeedBackHistorico = await pool.request()
            // Define os parâmetros
            .input('almope', sql.VarChar, almope)
            .input('dataInicio', sql.VarChar(10), dataInicio)
            .input('dataFim', sql.VarChar(10), dataFim)
            .execute('s_Sup_Digital_Feedback_Retorna_Historico');

        console.log('Procedure retorna cads');
        
        // Retorna o primeiro conjunto de resultados (index 0)
        let retorno = {
            feedbackHistorico: resultFeedBackHistorico.recordsets
        };

        res.json(retorno);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


module.exports = router;