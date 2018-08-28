import * as Joi from 'joi';


export const verificationEmail = Joi.object().keys({
  id: Joi.string().required().alphanum().description('User or admin id'),
  scope: Joi.string().only(['user', 'admin']).default('user').description('Account scope')
});

export const passwordReset = Joi.object().keys({
  id: Joi.string().required().alphanum().description('User or admin id')
});
