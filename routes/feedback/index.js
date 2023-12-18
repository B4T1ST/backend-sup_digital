//const sql = require('mssql');
const express = require('express');
const router = express.Router();
//const config = require('../../config/config.json');
//const connection = require('../../config' + config.banco);


router.get('/', function (req, res) {

    /*const{
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
        res.status(400).json('cComparativo não informado')
        return
    }
    */
    //retornaDados(almope, dataInicial, dataFinal, cComparativo, almopeResponsavel, isFirstRendering, res)
    retornaDados(res)
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
async function retornaDados(res){

    try{
        /*await sql.connect(connection);

        const request = new sql.Request();

        let resultLog = await request
        .input('almope', sql.VarChar, almope)
        .input('almopeResponsavel', sql.VarChar, almopeResponsavel)
        .input('local', sql.VarChar, isFirstRendering ? 'Login' : 'filtro')
        .input('cIndicador', sql.Int, -1)
        .execute('s_Insere_Log_Auditoria_Simplificada')

        let resultcards = await request
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_Retorna_Cards')

        console.log ('procedure retorna cads')

        let resultKPI = await request
            .input('almope', sql.VarChar, almope)
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .input('cComparativo', sql.Int, cComparativo)
            .execute('s_Monitoramento_Agentes_KPI')

        let resultUsuario = await request
            .input('almope', sql.VarChar, almope)
            .execute('s_Monitoramento_Agentes_Retorna_Dados_Colaborador')

        let resultDataAtualizacao = await request
            .input('dataInicial', sql.DateTime, dataInicial)
            .input('dataFinal', sql.DateTime, dataFinal)
            .execute('s_Monitoramento_Agentes_Retorna_Data_Atualizacao')
        */

        const jsonEstatico = [
            {
                "nome": "Atendidas",
                "nomeComparativo": "Resultado da equipe",
                "valor": "700",
                "valorComparativo": "660",
                "meta": "695",
                "corThr": "#07ae76",
                "cindicador": 1
            },
            {
                "nome": "TMA",
                "nomeComparativo": "Resultado da equipe",
                "valor": "659",
                "valorComparativo": "751",
                "meta": "852",
                "corThr": "#07ae76",
                "cindicador": 2
            },
            {
                "nome": "Absenteísmo",
                "nomeComparativo": "Resultado da equipe",
                "valor": "0%",
                "valorComparativo": "13.91%",
                "meta": "0%",
                "corThr": "#07ae76",
                "cindicador": 3
            },
            {
                "nome": "Tempo Logado",
                "nomeComparativo": "Resultado da equipe",
                "valor": "08:12:00",
                "valorComparativo": "07:18:46",
                "meta": "08:12:00",
                "corThr": "#07ae76",
                "cindicador": 4
            },
            {
                "nome": "Jackin",
                "nomeComparativo": "Resultado da equipe",
                "valor": "06:45:44",
                "valorComparativo": "05:15:24",
                "meta": "06:37:00",
                "corThr": "#07ae76",
                "cindicador": 9
            },
            {
                "nome": "Aderência",
                "nomeComparativo": "Resultado da equipe",
                "valor": "90.00",
                "valorComparativo": "81.00",
                "meta": "92.50",
                "corThr": "#595959",
                "cindicador": 99
            }
        ];
    
        let retorno = {
            cards: jsonEstatico,
            //kpi: resultKPI.recordset[0],
            //usuario: resultUsuario.recordset[0],
            //dataAtualizacao: resultDataAtualizacao
        }

        res.json(retorno)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

};

module.exports = router;