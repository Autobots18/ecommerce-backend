import { Request, ResponseToolkit, ResponseObject } from 'hapi';
import BaseController from '../helpers/base-controller';
import { GET, POST } from '../decorators/controller';
import User from '../models/user';
import Admin from '../models/admin';
import * as hash from '../utils/hash';
import * as token from '../utils/token';
import logger from '../helpers/logger';


class Test extends BaseController {
  constructor() {
    super('/api/auth');
  }

  @POST('/register', {
    auth: false,
    description: 'Create a user',
    tags: ['api']
  })
  async userRegister(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const {
        firstname,
        lastname,
        email,
        phone,
        gender,
        password
      } = request.payload;

      // TODO: Generate random avatar from gravatar
      const avatar = '';

      const hashedPassword = await hash.encrypt(password);

      const user: any = await User.create({
        firstname,
        lastname,
        email,
        phone,
        gender,
        isVerified: false,
        avatar,
        'additional.local.password': hashedPassword
      });

      // TODO: Call send verification email endpoint to send the user a verification email

      delete user['additional'];
      return h.response({
        user
      })
      .code(201);
    } catch (err) {
      logger.error('Unable to register user', err);
      return h.response({
        message: 'Unable to register user'
      })
      .code(400);
    }
  }

  @POST('/send_verification_email', {
    auth: false,
    description: 'Send verification email to user or admin',
    tags: ['api']
  })
  async sendVerificationEmail(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
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
          message: 'Invalid id'
        })
        .code(400);
      }

      // TODO: Don't hardcode token expiry. Pass it as environment variable
      // TODO: Don't hardcode token type
      const verificationToken = await token.create({
        id,
        type: 'account_verification',
        scope
      }, '1h');

      /** TODO: Send account verification email using emails endpoint
       * to user or admin, containing verification link
       */

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
}


export default Test;
