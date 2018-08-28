import * as Joi from 'joi';


const PASSWORD_LENGTH = parseInt(process.env.PASSWORD_MIN_LENGTH, 10);

export const userRegister = Joi.object().keys({
  firstname: Joi.string().required().min(3).description('User firstname'),
  lastname: Joi.string().required().min(3).description('User lastname'),
  email: Joi.string().required().email().description('User email address'),
  phone: Joi.string().required().description('User phone number'),
  gender: Joi.string().required().only(['male', 'female']).description('User gender'),
  password: Joi.string().required().min(PASSWORD_LENGTH).description('User password'),
  confirmPassword: Joi.string().required().min(PASSWORD_LENGTH).description('User password confirmation')
});

export const verifyAccount = Joi.object().keys({
  token: Joi.string().required().description('JWT token sent via email')
});

export const accountLogin = Joi.object().keys({
  email: Joi.string().required().email().description('Account email address'),
  password: Joi.string().required().min(PASSWORD_LENGTH).description('Account password'),
  scope: Joi.string().only(['user', 'admin']).default('user').description('Account scope')
});

export const userRequestPasswordReset = Joi.object().keys({
  email: Joi.string().email().description('User email address'),
  previousToken: Joi.string().description('Previous password reset token')
}).xor('email', 'previousToken');

export const userPasswordResetParams = Joi.object().keys({
  resetToken: Joi.string().required().description('Password reset token')
});

export const userPasswordResetPayload = Joi.object().keys({
  password: Joi.string().required().min(PASSWORD_LENGTH).description('New user password'),
  confirmPassword: Joi.string().required().min(PASSWORD_LENGTH).description('New user password confirmation')
});
