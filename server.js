// Requerimentos para o WEBServer
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;
// Define o diretório estático para funfar os arquivos HTML e CSS
app.use(express.static(path.join(__dirname, 'public')));
// Requerimentos Extra
const c = require('colors')
// Requerimentos para o Logger
const fetch = require("isomorphic-fetch");
const { sendWebhook } = require("./logger");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const ip_token = process.env.ip_token;

// Rota para a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página "Contact"
app.get('/projetos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

// Rota para a pagina Sobre
app.get("/sobre", async (req, res) => {
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const { region, city, country, postal } = await (await fetch(`https://ipinfo.io/${ipAddress}?token=${ip_token}`)).json();
    const lang = req.headers["accept-language"]?.split(",")[0] || "Unknown";
    const platform = userAgent ? userAgent.split("(")[1].split(")")[0] : "Unknown";
    const browser = userAgent ? userAgent.split("/")[0] : "Unknown";
    const isProxy = req.headers["via"] || req.headers["x-forwarded-for"];
    try {
      const embed = new MessageBuilder()
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
        .setTimestamp();
     
      await sendWebhook(embed);
      res.sendFile(path.join(__dirname, 'public', 'about.html'));
    } catch (error) {
      console.error(`Error handling request:\n${error.stack}`);
      res.status(500).send("Internal server error");
    }
  });

// Inicia o servidor
app.listen(port, () => {
    console.log(c.green(`[SERVER] Servidor está rodando em http://localhost:${port}`));
});
