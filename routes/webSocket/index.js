const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Função para enviar uma rota GET quando um cliente se conecta
function enviarRotaGET(ws) {
  const url = `http://localhost:3001/feedbackHistorico/`;
  ws.send(url);
}


// Configuração do WebSocket
wss.on('connection', (ws) => {
    // Envie a rota GET assim que o cliente se conectar
    enviarRotaGET(ws);
  
    // Lógica para tratar mensagens recebidas do cliente
    ws.on('message', (message) => {
      console.log(`Mensagem recebida do cliente: ${message}`);
      // Se a mensagem for um comando de detecção de usuário, envie a rota GET
      if (message === 'detectarUsuario') {
        enviarRotaGET(ws);
      }
    });
  });
  
  

// Rota GET para a página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Inicie o servidor
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket rodando na porta ${PORT}`);
});
