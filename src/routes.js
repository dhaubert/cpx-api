const express = require("express");

const routes = express.Router();

routes.get('/', (req, res) => {
   res.send('Hello cupinxa.');
});
const WalletController = require('../src/app/controllers/WalletController');
routes.get('/wallet/:username', WalletController.read);

module.exports = routes;
