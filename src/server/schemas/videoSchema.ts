import Joi from 'joi'

const messages = {
  'string.empty': 'Por favor, envie um vídeo.',
  'any.required': 'Por favor, envie um vídeo.',
  'string.pattern.base': 'Por favor, envie um arquivo de vídeo válido.',
  'file.fieldname': 'Por favor, envie um vídeo.',
}

const videoSchema = Joi.object({
  body: Joi.object({
    mimetype: Joi.string()
      .required()
      .regex(/^video\//)
      .messages(messages),
  })
    .required()
    .messages(messages).unknown(),
}).messages(messages)

export default videoSchema
