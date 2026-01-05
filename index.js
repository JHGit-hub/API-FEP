/******************************************/
/*************** IMPORTS ******************/
/******************************************/

// On importe la librairie "express" qui sert à créer un serveur web (API HTTP)
const express = require('express');

// On importe "cors" pour appeler l’API sans blocage navigateur
const cors = require('cors');

// On importe le module "fs" pour lire/écrire des fichiers sur le serveur
const fs = require('fs');

// On importe le module "path" pour gérer les chemins de fichiers
const path = require('path');



/******************************************/
/*************** INIT **********************/
/******************************************/

// On crée l'application Express "app" représente le serveur
const app = express();

// On définit le port sur lequel le serveur va écouter
// 3000 = http://localhost:3000
const PORT = 3000;



/******************************************/
/*************** MIDDLEWARES **************/
/******************************************/

// On autorise les requêtes venant d'autres domaines (frontend) pour que le navigateur ne bloque pas les appels API
app.use(cors());

// On indique à Express qu’on va recevoir/envoyer du JSON
app.use(express.json());



/******************************************/
/***************** CONFIG *****************/
/******************************************/

// Chemin vers le fichier JSON du catalogue des farines
const cataloguePath = path.join(__dirname, 'data', 'catalogue.json');

// Chemin vers le fichier JSON des détails des farines
const detailsPath = path.join(__dirname, 'data', 'farines.json');



/******************************************/
/***************** ROUTES *****************/
/******************************************/

/* Création des Route GET
    - /catalogue -> renvoie le catalogue de produits
    - /catalogue?ref=XXX -> renvoie le produit avec la référence XXX
*/


app.get('/catalogue', (req, res) => {

    // On lit le fichier JSON du catalogue de farines
    const rowData = fs.readFileSync(cataloguePath, 'utf-8');

    // On lit le fichier JSON des détails des farines
    const detailsData = fs.readFileSync(detailsPath, 'utf-8');

    // On transforme les données JSON en objet JavaScript
    const catalogue = JSON.parse(rowData);
    const details = JSON.parse(detailsData);

    // On vérifie si un paramètre "ref" est présent dans l'URL
    const ref = req.query.ref;

    // si "ref" est présent, on cherche le produit correspondant
    if (ref) {
        // On cherche la farine avec la référence demandée
        const flour = details.find(item => item.reference === ref);

        // Si on a trouvé la farine, on la renvoie
        if (flour) {
            return res.json(flour);
        } else {
            // Si on n'a pas trouvé la farine, on renvoie une erreur 404
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
    }

    // On renvoie le catalogue complet si pas de paramètre "ref"
    res.json(catalogue);

});

/******************************************/
/********** DÉMARRAGE DU SERVEUR **********/
/******************************************/

// On lance le serveur
// Express écoute les requêtes HTTP sur le port défini
app.listen(PORT, () => {

    // Message affiché dans la console quand le serveur est prêt
    console.log(`API démarrée sur http://localhost:${PORT}`);

});
