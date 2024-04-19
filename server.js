// Requerimentos para o WEBServer
const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const { Webhook, MessageBuilder } = require("discord-webhook-node");  
const port = process.env.PORT || 80;
// Define o diretório estático para funfar os arquivos HTML e CSS
app.use(express.static(path.join(__dirname, 'public')));
// Requerimentos Extra
const c = require('colors')
// Requerimentos para o Logger
const fetch = require("isomorphic-fetch");
const { sendWebhook } = require("./logger");
var pais
var distrito
var cidade
var codigopostal
var coordenadas
var operadoraisp
var operadoraorg
var timezone
var totalISP

// Rota para a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página "Contact"
app.get('/projetos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/pfp.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pfp.png'));
});


// Rota para a pagina Sobre
app.get("/sobre", async (req, res) => {
    
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    fetch(`http://ip-api.com/json/${ipAddress}`)
      .then(response => response.json())
          .then(data1 => {
        pais = data1.country;
        distrito = data1.regionName;
        cidade = data1.city;
        codigopostal = data1.zip;
        coordenadas = data1.lat + "/" + data1.lon;
        operadoraisp = data1.isp; 
        operadoraorg = data1.org;
        timezone = data1.timezone;
        totalISP = data1.as;
      })
    const userAgent = req.headers["user-agent"];
    const platforma = userAgent ? userAgent.split("(")[1].split(")")[0] : "Desconhecido?";
    try {
      const embed = new MessageBuilder()
        .setTitle("smenezes.pt - logs")
        .addField("> **Pais: **", pais || "Sem dados")
        .addField("> **Cidade: **", cidade || "Sem dados")
        .addField("> **Codigo Postal: **", codigopostal || "Sem dados")
        .addField("> **Coordenadas: **", coordenadas || "Sem dados")
        .addField("> **Operadora: **", totalISP || "Sem dados")
        .addField("> **IP: **", ipAddress || "Sem dados")
        .addField("> **Plataforma**", platforma || "Sem dados")
        .addField("> **Link para o IP Locator**", `[ABRIR LINK](https://iplocation.io/ip/${ipAddress})` || "Sem dados")
        .setColor("#f37a0c")
      await sendWebhook(embed);
      res.sendFile(path.join(__dirname, 'public', 'about.html'));
    } catch (error) {
      console.error(`Error handling request:\n${error.stack}`);
      res.status(500).send("Ooops, ocorreu um erro.");
    }
  });

// Inicia o servidor
app.listen(port, () => {
    console.log(c.green(`[SERVER] Servidor está rodando em http://localhost:${port}`));
});
