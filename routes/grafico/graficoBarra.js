//carregando modulos
const sql = require('mssql');
const express = require('express');
const router = express.Router();
const config = require('../../../config/config.json');
const { get } = require('../../../lib/poolManager')
const connection = require('../../../config/' + config.monitoriaAgentes);

//Aplica alteração no status da sanção apartir das ações do Acompanhamento de Sanções
router.get('/', function (req, res) {
    const {
        almope,
        dataInicial,
        dataFinal,
        cComparativo,
        cIndicador,
        almopeResponsavel
    } = req.query

    console.log(dataInicial,dataFinal,'GraficoBarra')
    if (!almope) {
        res.status(400).json('almope não informado.')
        return
    }

    if (!cComparativo) {
        res.status(400).json('cComparativo não informado.')
        return
    }

    if (!cIndicador) {
        res.status(400).json('cIndicador não informado.')
        return
    }

    retornaDados(almope, dataInicial, dataFinal, cComparativo, cIndicador, almopeResponsavel, res)
});

async function retornaDados(almope, dataInicial, dataFinal, cComparativo, cIndicador, almopeResponsavel, res) {
    try {

        let pool = await get('BDRechamadasGeral', connection)

        // Requisição do banco
        let resultLog = await pool.request()
            .input('almope', sql.VarChar, almope)
            .input('almopeResponsavel', sql.VarChar, almopeResponsavel ? almopeResponsavel : -1)
            .input('local', sql.VarChar, 'Indicador')
            .input('cIndicador', sql.Int, cIndicador)
            .execute('s_Insere_Log_Auditoria_Simplificada')

        let result = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .input('cIndicador', sql.Int, cIndicador)
            .execute('s_Monitoramento_Agentes_Retorna_Grafico_Barra_V5')


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