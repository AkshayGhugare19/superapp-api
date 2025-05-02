const express = require('express');
const conversationControllers = require('../modules/chats/conversations/controllers');
const auth = require('../middlewares/auth');
const { roles } = require('../config/enums');
const validate = require('../middlewares/validate');
const conversationValidations = require('../modules/chats/conversations/conversations.validations')
const router = express.Router();

router.route('/create').post(auth([roles.consumer, roles.merchant,roles.agent]), validate(conversationValidations?.oneToOneChatValidation), conversationControllers.createConversation);



module.exports = router;




// POST /api/conversations
//  Create a new conversation.


// GET /api/conversations
//  Retrieve all conversations for the authenticated user.


// GET /api/conversations/:id
//  Retrieve a specific conversation by ID.


// PATCH /api/conversations/:id
//  Update conversation details (e.g., name, avatar).


// DELETE /api/conversations/:id
//  Delete a conversation.