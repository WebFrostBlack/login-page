const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const mdp = 'monmotdepasse';
const userName = 'monmotdepasse';

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 100000 }
}));

const verifierAcces = (req, res, next) => {
  if (req.session.autorise && req.session.username && req.ip === "86.242.112.55") {
    next();
  } else {
    res.status(403).sendFile(path.join(__dirname, '/public/403.html'));
  }
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/secret', verifierAcces, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/secret.html'));
});

app.post('/verifier-mdp', (req, res) => {
  const inputUsername = req.body.username;
  const inputMdp = req.body.mdp;
  if (inputUsername === userName && inputMdp === mdp) {
    req.session.autorise = true;
    req.session.username = inputUsername;
    res.redirect('/secret');
  } else {
    res.status(401).sendFile(path.join(__dirname, '/public/401.html'));
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
});

app.listen(3000, () => {
  console.log('Le serveur est lancé sur http://localhost:3000');
});
