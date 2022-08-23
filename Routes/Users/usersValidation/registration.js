const Joi = require("Joi");

function validateRegistration(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    address: Joi.string().min(6).max(1024).required(),
    phone: Joi.string().min(9).max(16).required(),
  });

  return schema.validate(user);
}

exports.validateRegistration = validateRegistration;
