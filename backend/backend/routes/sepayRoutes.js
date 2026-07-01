const express = require('express');
const router = express.Router();
const sepayController = require('../controllers/sepayController');

// Webhook endpoint
router.post('/webhook', sepayController.handleWebhook);

module.exports = router;
