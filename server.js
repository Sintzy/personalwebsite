// Requerimentos para o WEBServer
const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const port = process.env.PORT || 80;
// Define o diretório estático para funfar os arquivos HTML e CSS
app.use(express.static(path.join(__dirname, 'public')));
// Requerimentos Extra
const c = require('colors')
// Requerimentos para o Logger
const fetch = require("isomorphic-fetch");
const { sendWebhook } = require("./logger");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const ip_token = process.env.ip_token;
var pais
var distrito
var Cidade
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

// Situação para ter o ip publico
http.get('http://api.ipify.org', (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
    var ip = data
    fetch(`http://ip-api.com/json/${data}`)
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
        ip = data.query;
})
  });
  resp.on('end', () => {
    ip = data
  });
}).on("error", (err) => {
});



// Rota para a pagina Sobre
app.get("/sobre", async (req, res) => {
    

    const userAgent = req.headers["user-agent"];
    const browserlang = req.headers["accept-language"]?.split(",")[0] || "Desconhecido?";
    const platforma = userAgent ? userAgent.split("(")[1].split(")")[0] : "Desconhecido?";
    const browser = userAgent ? userAgent.split("/")[0] : "Desconhecido?";
    try {
      const embed = new MessageBuilder()
<<<<<<< HEAD
        .setTitle("smenezes.pt - logs")
        .addField("> **Pais: **", pais)
        .addField("> **Cidade: **", cidade || "Sem dados")
        .addField("> **Codigo Postal: **", codigopostal || "Sem dados")
        .addField("> **Coordenadas: **", coordenadas || "Sem dados")
        .addField("> **Operadora: **", totalISP || "Sem dados")
        .addField("> **IP: **", ip || "Sem dados")
        .addField("> **Plataforma**", platforma || "Sem dados")
        .addField("> **Link para o IP Locator**", `[ABRIR LINK](https://iplocation.io/ip/${ip})` || "Sem dados")
        .setColor("#f37a0c")
=======
        .setTitle("Sistema de logs")
        .setFooter(`Abrir [ip locator](https://iplocation.io/ip/${ipAddress}`)
        .addField("IP", ipAddress)
        .addField("User Agente", userAgent)
        .addField("Lingua do Browser", lang)
        .addField("Platforma", platform)
        .addField("Browser", browser)
        .addField("Proxy/VPN", isProxy ? "Sim" : "Não")
        .addField("Pais", country || "Sem dados")
        .addField("Região", region || "Sem dados")
        .addField("Cidade", city || "Sem dados")
        .addField("Codigo Postal", postal || "Sem dados")
        .setColor("ORANGE")
>>>>>>> 6dbd245801b3396fac3084c7186185abbb16c5e3
        .setTimestamp();
     
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
