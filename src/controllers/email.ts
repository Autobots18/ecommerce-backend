import * as querystring from 'querystring';
import { ResponseToolkit, ResponseObject } from 'hapi';
import axios from 'axios';
import BaseController from '../helpers/base-controller';
import { POST } from '../decorators/controller';
import User from '../models/user';
import Admin from '../models/admin';
import * as token from '../utils/token';
import logger from '../helpers/logger';
import * as validator from '../routes/validators/email';


const ES_HOST = process.env.ELASTICEMAIL_API_HOST;
const ES_KEY = process.env.ELASTICEMAIL_API_KEY;
const APP_NAME = process.env.APP_NAME;
const APP_URL = process.env.MAIN_APP_URL;

class Email extends BaseController {
  constructor() {
    super('/api/emails');
  }

  @POST('/welcome', {
    auth: false,
    description: 'Send welcome email to user or admin',
    tags: ['api'],
    validate: {
      payload: validator.verificationEmail
    }
  })
  async welcomeEmail(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const {
        id,
        scope
      } = request.payload;

      let person: any = null;

      if (scope === 'admin') {
        person = await Admin.findById(id);
      } else {
        person = await User.findById(id);
      }

      if (!person) {
        return h.response({
          message: 'Invalid account id'
        })
        .code(400);
      }

      if (person.isVerified) {
        return h.response({
          message: 'Account already verified'
        })
        .code(400);
      }

      const params = {
        apikey: ES_KEY,
        isTransactional: true,
        template: 'autobotsWelcome',
        msgTo: person.email,
        merge_appName: APP_NAME,
        merge_appUrl: APP_URL,
        merge_name: person.name,
        merge_year: (new Date()).getFullYear()
      };

      const paramsQueryString = querystring.stringify(params);
      const url = `${ES_HOST}/email/send?${paramsQueryString}`;

      const response = await axios.post(url, { params });
      logger.info('Account welcome email response', response.data);

      return h.response({
        message: 'Success'
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to send welcome email', err);
      return h.response({
        message: 'Unable to send welcome email'
      })
      .code(400);
    }
  }

  @POST('/account_verification', {
    auth: false,
    description: 'Send verification email to user or admin',
    tags: ['api'],
    validate: {
      payload: validator.verificationEmail
    }
  })
  async verificationEmail(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const {
        id,
        scope
      } = request.payload;

      let person: any = null;

      if (scope === 'admin') {
        person = await Admin.findById(id);
      } else {
        person = await User.findById(id);
      }

      if (!person) {
        return h.response({
          message: 'Invalid account id'
        })
        .code(400);
      }

      if (person.isVerified) {
        return h.response({
          message: 'Account already verified'
        })
        .code(400);
      }

      const verificationToken = await token.create({
        id,
        type: 'account_verification',
        scope
      }, process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY);

      const verificationUrl = `${process.env.MAIN_APP_URL}/auth/verify/${verificationToken}`;

      const params = {
        apikey: ES_KEY,
        isTransactional: true,
        template: 'autobotsAccountConfirmation',
        msgTo: person.email,
        merge_appName: APP_NAME,
        merge_appUrl: APP_URL,
        merge_name: person.name,
        merge_verificationLink: verificationUrl,
        merge_year: (new Date()).getFullYear()
      };

      const paramsQueryString = querystring.stringify(params);
      const url = `${ES_HOST}/email/send?${paramsQueryString}`;

      const response = await axios.post(url, { params });
      logger.info('Account verification email response', response.data);

      return h.response({
        message: 'Success'
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to send verification email', err);
      return h.response({
        message: 'Unable to send verification email'
      })
      .code(400);
    }
  }

  @POST('/password_reset/{id}', {
    auth: false,
    description: 'Send password reset email to user or admin',
    tags: ['api'],
    validate: {
      params: validator.passwordReset
    }
  })
  async passwordResetEmail(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const user: any = await User.findById(request.params.id);

      if (!user) {
        return h.response({
          message: 'Invalid account id'
        })
        .code(400);
      }

      const resetToken = await token.create({
        id: user.id,
        type: 'account_password_reset',
        scope: ['user']
      }, process.env.PASSWORD_RESET_TOKEN_EXPIRY);

      const resetUrl = `${process.env.MAIN_APP_URL}/auth/password_reset/${resetToken}`;

      const params = {
        apikey: ES_KEY,
        isTransactional: true,
        template: 'autobotsPasswordReset',
        msgTo: user.email,
        merge_appName: APP_NAME,
        merge_appUrl: APP_URL,
        merge_name: user.name,
        merge_verificationLink: resetUrl,
        merge_year: (new Date()).getFullYear()
      };

      const paramsQueryString = querystring.stringify(params);
      const url = `${ES_HOST}/email/send?${paramsQueryString}`;

      const response = await axios.post(url, { params });
      logger.info('Password reset email response', response.data);

      return h.response({
        message: 'Success'
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to send password reset email', err);
      return h.response({
        message: 'Unable to send password reset email'
      })
      .code(400);
    }
  }
}


export default Email;
