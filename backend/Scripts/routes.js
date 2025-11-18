const express = require("express");
const router = express.Router();
const donationController = require("./donationController.js");

// Criar doação
router.post("/donate", donationController.createDonation);

// Webhook do PagSeguro
router.post("/pagseguro/webhook", donationController.pagseguroWebhook);

module.exports = router;
