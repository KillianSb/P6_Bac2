//Inclusion des différents modules utiles à l'application
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//Inclusion des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Création de l'application
const app = express();

//Connexion à la BDD
mongoose.connect('mongodb+srv://Piiquante:fmQKlm4OyflZKedi@cluster0.lzg60ie.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connexion à MongoDB réussie !")
}).catch(() => {
    console.error("Connexion à MongoDB échouée !")
});

//Modification des headers pour autoriser les accès cross origin et les methodes utilisées par l'API
app.use((_request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//Utilisation du dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Application des routes d'authentification
app.use('/api/auth', userRoutes);

//Application des routes concernant les sauces
app.use('/api/sauces', sauceRoutes);

module.exports = app;