const express = require('express');
const path = require('path');
const c = require('colors')
const app = express();
const port = process.env.PORT || 3000;

// Define o diretório estático para servir os arquivos HTML e CSS
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página "About Me"
app.get('/sobre', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Rota para a página "Contact"
app.get('/projetos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

// Inicia o servidor
app.listen(port, () => {
    console.log(c.green(`[SERVER] Servidor está rodando em http://localhost:${port}`));
});
