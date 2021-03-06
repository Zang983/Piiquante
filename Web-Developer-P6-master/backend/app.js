const express = require('express');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();//création de la fonction express permettant de créer le serveur.
app.use(express.json());//permet d'écouter les requêtes avec un content-type JSON cela le met dans req.body

mongoose.connect('mongodb+srv://zang:3jm9sxAqGH5GuKBf@tutomongo.rknhi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;
