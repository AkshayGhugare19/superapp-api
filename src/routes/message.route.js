const express = require('express');
const messageControllers = require('../modules/chats/messages/controllers');
const auth = require('../middlewares/auth');
const { roles } = require('../config/enums');
const validate = require('../middlewares/validate');
const messagesValidations = require('../modules/chats/messages/messages.validations')
const router = express.Router();

router.route('/send').post(auth([roles.consumer, roles.merchant,roles.agent]), validate(messagesValidations?.messageValidation), messageControllers.sendMessage);
router.route('/get').get(auth([roles.consumer, roles.merchant,roles.agent]), validate(messagesValidations?.getMessageValidation), messageControllers.getMessages);

module.exports = router;


// POST /api/messages
//  Send a new message.


// GET /api/conversations/:id/messages
//  Retrieve messages for a specific conversation.


// GET /api/messages/:id
//  Retrieve a specific message by ID.


// PATCH /api/messages/:id
//  Edit a message.

