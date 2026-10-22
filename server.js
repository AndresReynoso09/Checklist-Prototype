const express = require('express');
const path = require('path');

const modelos = require('./data-modelos');
const ediciones = require('./data-ediciones');
const presentaciones = require('./data-presentaciones');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/modelos', (req, res) => {
  res.json(modelos);
});

app.get('/api/ediciones', (req, res) => {
  res.json(ediciones);
});

app.get('/api/presentaciones', (req, res) => {
  res.json(presentaciones);
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
