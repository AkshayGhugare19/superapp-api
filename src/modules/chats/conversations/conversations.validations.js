const Joi = require('joi');
const { followStatus, messageTypes } = require('../../../config/enums');


const createConversationSchema = {
  body: Joi.object({
    chatType: Joi.string().valid('one-to-one', 'group').required(),
    participants: Joi.array().items(Joi.string().uuid()).min(2).required(),  // Ensuring we have 2 partic
  })
}


const conversationValidation = {
  body: Joi.object({
    participant2Id: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
      'string.empty': `The 'participant2Id' field is required and cannot be empty. Please provide a valid participant2Id`,
      'any.required': `The 'participant2Id' field is required. Please include it in your request.`,
    }),
    tenderId: Joi.string().guid({ version: ['uuidv4'] }).optional().messages({
      'string.empty': `The 'tenderId' field is optional but if provided, it must be a valid UUID.`,
      'any.required': `The 'tenderId' field is optional and not required. If included, it must be a valid UUID.`,
    }),
  })
}

const oneToOneChatValidation = {
  body: Joi.object({
    participantIds: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }))
    .length(2)
    .required()
    .messages({
      'array.base': 'participantIds must be an array.',
      'array.length': 'Exactly 2 participants are required for a one-to-one conversation.',
      'array.includes': 'Each participantId must be a valid UUID.',
      'any.required': 'participantIds is required.'
    })

  })
}


module.exports = {
  conversationValidation,
  createConversationSchema,
  oneToOneChatValidation
};
