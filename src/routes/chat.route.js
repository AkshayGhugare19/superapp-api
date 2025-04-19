const express = require('express');
const chatControllers = require('../modules/chats/controllers');
const auth = require('../middlewares/auth');
const { roles } = require('../config/enums');
const validate = require('../middlewares/validate');
const chatValidations = require('../modules/chats/chat.validations')
const router = express.Router();

router.route('/sendMessages').post(auth([roles.consumer, roles.merchant,roles.agent]), validate(chatValidations?.messageValidation), chatControllers.sendMessage);
router.route('/getMessages').get(auth([roles.consumer, roles.merchant,roles.agent]), validate(chatValidations?.getMessageValidation), chatControllers.getMessages);
// router.route('/getMessages/:conversationId').post(chatControllers.getMessages);

router.route('/conversation').post(auth([roles.consumer, roles.merchant,roles.agent]), validate(chatValidations?.conversationValidation), chatControllers.createConversation);
router.route('/getUsers').get(auth([roles.consumer, roles.merchant,roles.agent]), chatControllers.getUsers);



module.exports = router;
