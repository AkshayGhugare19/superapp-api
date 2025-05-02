const Joi = require('joi');
const { followStatus, messageTypes } = require('../../config/enums');



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
    messageType: Joi.string().valid(...Object.values(messageTypes)).optional().messages({
      'string.empty': `The 'messageType' field cannot be empty if provided. Please provide a valid messageType`,
      'any.only': `The 'messageType' must be one of the following: ${Object.values(messageTypes).join(', ')}`,
    })
  })
}
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

const createGroupSchema = {
  body: Joi.object({
  groupName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.base': 'Group name must be a text.',
      'string.empty': 'Group name is required.',
      'any.required': 'Group name is required.',
      'string.max': 'Group name must be at most 100 characters.',
    }),

  groupDescription: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Group description must be at most 500 characters.',
    }),

  groupImage: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Group image must be a valid URL.',
    }),

  participantIds: Joi.array()
    .items(Joi.string().uuid().required().messages({
      'string.uuid': 'Each participant ID must be a valid UUID.',
    }))
    .min(1)
    .unique()
    .required()
    .messages({
      'array.base': 'Participant list must be an array.',
      'array.min': 'At least one participant (besides admin) is required.',
      'array.unique': 'Participant IDs must not contain duplicates.',
      'any.required': 'Participant list is required.',
    }),
})
};


module.exports = {
  messageValidation,
  getMessageValidation,
  createConversationSchema  ,
  conversationValidation,
  oneToOneChatValidation,
  createGroupSchema,
};
