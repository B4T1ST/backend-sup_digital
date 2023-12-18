//carregando modulos
const express           = require('express');
const cors           = require('cors');

//Relatorios
const feedbackHistoricoRouter           = require('./routes/feedbackHistorico/index');
const cardsRouter           = require('./routes/cards');
const tortaRouter           = require('./routes/torta');



const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
const port = process.env.PORT || 3001;


//rota de cards
app.use('/cards', cardsRouter );

//rota do grafico torta
app.use('/graficoTorta', tortaRouter );

app.use('/feedbackHistorico', feedbackHistoricoRouter)



app.listen(port, () => {
    console.log(`Servidor Express rodando na porta ${port}`);
});