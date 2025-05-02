const Joi = require('joi');
const { messageTypes, mediaTypes } = require('../../../config/enums');


// Validation schema for creating a message
const messageValidation = {
  body: Joi.object({
    conversationId: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
      'string.empty': `The 'conversationId' field is required and cannot be empty. Please provide a valid conversationId.`,
      'any.required': `The 'conversationId' field is required. Please include it in your request.`,
    }),
    message: Joi.string().optional().messages({
      'string.empty': `The 'message' field cannot be empty if provided. Please provide a valid message.`,
    }),
    messageType: Joi.string().valid(...Object.values(messageTypes)).optional().messages({
      'string.empty': `The 'messageType' field cannot be empty if provided. Please provide a valid messageType.`,
      'any.only': `The 'messageType' must be one of the following: ${Object.values(messageTypes).join(', ')}`,
    }),
    media: Joi.array().items(
      Joi.object({
        mediaUrl: Joi.string().uri().required().messages({
          'string.uri': `The 'mediaUrl' must be a valid URI.`,
          'any.required': `The 'mediaUrl' field is required. Please include a valid media URL.`,
        }),
        mediaMimeType : Joi.string()
  .pattern(/^(image|video|audio)\//)
  .required()
  .messages({
    'string.empty': `The 'mediaMimeType' field is required. Please provide a valid MIME type.`,
    'string.pattern.base': `The 'mediaMimeType' must start with one of: image/, video/, audio/, or application/.`,
  }),
      
      })
    ).optional().messages({
      'array.base': `The 'media' field must be an array of media objects.`,
    }),
  }),
};

// Validation schema for getting a message
const getMessageValidation = {
  query: Joi.object({
    receiverId: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
      'string.empty': `The 'receiverId' field is required and cannot be empty. Please provide a valid receiverId.`,
      'any.required': `The 'receiverId' field is required. Please include it in your request.`,
    }),
    conversationId: Joi.string().guid({ version: ['uuidv4'] }).optional().messages({
      'string.guid': `The 'conversationId' must be a valid UUID.`,
    }),
  }),
};

module.exports = {
  messageValidation,
  getMessageValidation,
};
