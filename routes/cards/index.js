//carregando modulos
const sql = require('mssql');
const express = require('express');
const router = express.Router();
const config = require('../../../config/config.json');
const { get } = require('../../../lib/poolManager')
const connection = require('../../../config/' + config.monitoriaAgentes);


router.use('/graficoBarra', require('./graficoBarra'))
router.use('/agentes', require('./agentes'))
router.use('/comparativos', require('./comparativos'))

//Aplica alteração no status da sanção apartir das ações do Acompanhamento de Sanções
router.get('/', function (req, res) {

    const {
        almope,
        dataInicial,
        dataFinal,
        cComparativo,
        almopeResponsavel,
        isFirstRendering
    } = req.query

    if (!almope) {
        res.status(400).json('almope não informado.')
        return
    }

    if (!cComparativo) {
        res.status(400).json('cComparativo não informado.')
        return
    }

    retornaDados(almope, dataInicial, dataFinal, cComparativo, almopeResponsavel, isFirstRendering,  res)
});

router.get('/extracaoXlsx', function (req, res) {

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
        res.status(400).json('cComparativo não informado.')
        return
    }

    retornaDadosExtracao(almope, dataInicial, dataFinal, cComparativo, res)
});

router.get('/extracaoXlsx/agrupados', function (req, res) {

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
        res.status(400).json('cComparativo não informado.')
        return
    }

    retornaDadosExtracaoAgrupados(almope, dataInicial, dataFinal, cComparativo, res)
});

router.get('/pausas', function (req, res) {

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
        res.status(400).json('cComparativo não informado.')
        return
    }

    retornaDadosPausa(almope, dataInicial, dataFinal, cComparativo, res)
});

async function retornaDadosPausa(almope, dataInicial, dataFinal, cComparativo, res) {
    try {

        let pool = await get('BDRechamadasGeral', connection)
        // Requisição do banco
        let result = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Pausas_v2')


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

router.get('/monitorias', function (req, res) {

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
        res.status(400).json('cComparativo não informado.')
        return
    }

    retornaDadosMonitoria(almope, dataInicial, dataFinal, cComparativo, res)
});

async function retornaDadosMonitoria(almope, dataInicial, dataFinal, cComparativo, res) {
    try {

        let pool = await get('BDRechamadasGeral', connection)
        // Requisição do banco
        let result = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Monitorias')


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

async function retornaDados(almope, dataInicial, dataFinal, cComparativo, almopeResponsavel, isFirstRendering, res) {
    try {        

        let pool = await get('BDRechamadasGeral', connection)
        console.log('procedura retorna cards orimeira request')

        let resultLog = await pool.request()
            .input('almope', sql.VarChar, almope)
            .input('almopeResponsavel', sql.VarChar, almopeResponsavel ? almopeResponsavel : -1)
            .input('local', sql.VarChar, isFirstRendering ? 'Login' : 'Filtro')
            .input('cIndicador', sql.Int, -1)
            .execute('s_Insere_Log_Auditoria_Simplificada')

        // Requisição do banco
        let resultCards = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Cards_V5')

        console.log('procedura retorna cards')

        let resultTorta = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Grafico_Torta')

            console.log('procedura retorna cards')
    
        let resultTabela = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Tabela_V3')

        let resultTabelaAgrup = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Tabela_Agrupada_V3')

        let resultTermometro = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Termometro')

        let resultUsuario= await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .execute('s_Monitoramento_Agentes_Retorna_Dados_Colaborador')

        let resultDataAtualizacao= await pool.request()
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .execute('s_Monitoramento_Agentes_Retorna_Data_Atualizacao_V2')    
        

        let retorno = {
            cards: resultCards?.recordset,
            torta: resultTorta?.recordset,
            tabela: resultTabela?.recordset,
            tabelaAgrupada: resultTabelaAgrup?.recordset,
            termometro: resultTermometro?.recordset[0],
            usuario: resultUsuario?.recordset[0],
            dataAtualizacao: resultDataAtualizacao.recordset
        }        

        res.json(retorno)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

async function retornaDadosExtracao(almope, dataInicial, dataFinal, cComparativo, res) {
    try {

        let pool = await get('BDRechamadasGeral', connection)
        // Requisição do banco
        let result = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Extracao_Tabela_Xlsx_V3')


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

async function retornaDadosExtracaoAgrupados(almope, dataInicial, dataFinal, cComparativo, res) {
    try {

        let pool = await get('BDRechamadasGeral', connection)
        // Requisição do banco
        let result = await pool.request()
            //define os parametros
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Extracao_Tabela_Xlsx_Agrupada_v2')


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