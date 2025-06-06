const Joi = require('joi');
const { followStatus } = require('../../config/enums');



const messageValidation = {
  body: Joi.object({
    conversationId: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
      'string.empty': `The 'conversationId' field is required and cannot be empty. Please provide a valid conversationId`,
      'any.required': `The 'conversationId' field is required. Please include it in your request.`,
    }),
    message: Joi.string().required().messages({
      'string.empty': `The 'message' field is required and cannot be empty. Please provide a valid message`,
      'any.required': `The 'message' field is required. Please include it in your request.`,
    }),
    receiverId: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
      'string.empty': `The 'receiverId' field is required and cannot be empty. Please provide a valid receiverId`,
      'any.required': `The 'receiverId' field is required. Please include it in your request.`,
    }),
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

const getMessageValidation = {
  query: Joi.object({
    receiverId: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
      'string.empty': `The 'receiverId' field is required and cannot be empty. Please provide a valid receiverId`,
      'any.required': `The 'receiverId' field is required. Please include it in your request.`,
    }),
    conversationId: Joi.string().guid({ version: ['uuidv4'] }).optional().messages({
      'string.guid': `The 'conversationId' must be a valid UUID.`,
    }),
  })
}

module.exports = {
  messageValidation,
  conversationValidation,
  getMessageValidation
};
