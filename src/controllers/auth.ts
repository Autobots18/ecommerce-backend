import { ResponseToolkit, ResponseObject } from 'hapi';
import * as gravatar from 'gravatar';
import BaseController from '../helpers/base-controller';
import { GET, POST } from '../decorators/controller';
import User from '../models/user';
import Admin from '../models/admin';
import * as hash from '../utils/hash';
import * as token from '../utils/token';
import logger from '../helpers/logger';
import * as validator from '../routes/validators/auth';


const GRAVATAR_CONFIG = {
  size: '200',
  default: 'wavatar'
};

class Auth extends BaseController {
  constructor() {
    super('/api/auth');
  }

  @POST('/register', {
    auth: false,
    description: 'Create a user',
    tags: ['api'],
    validate: {
      payload: validator.userRegister
    }
  })
  async userRegister(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const {
        firstname,
        lastname,
        email,
        phone,
        gender,
        password,
        confirmPassword
      } = request.payload;

      if (password !== confirmPassword) {
        return h.response({
          message: 'Passwords do not match'
        })
        .code(400);
      }

      const avatar = gravatar.url(email, GRAVATAR_CONFIG, true);
      const hashedPassword = await hash.encrypt(password);

      let user: any = await User.create({
        firstname,
        lastname,
        email,
        phone,
        gender,
        isVerified: false,
        avatar,
        'additional.local.password': hashedPassword
      });

      await request.server.inject({
        url: '/api/emails/welcome',
        method: 'POST',
        payload: {
          id: user.id,
          scope: 'user'
        }
      });

      await request.server.inject({
        url: '/api/emails/account_verification',
        method: 'POST',
        payload: {
          id: user.id,
          scope: 'user'
        }
      });

      user = user.toObject();
      delete user['additional'];
      delete user['addresses'];

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

  @GET('/verify/{token}', {
    auth: false,
    description: 'Verification account of user or admin',
    tags: ['api'],
    validate: {
      params: validator.verifyAccount
    }
  })
  async verifyAccount(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const decoded: any = await token.decode(request.params.token);

      if (!decoded.id || !decoded.type || decoded.type !== 'account_verification') {
        throw new Error('Invalid token');
      }

      let person: any = null;

      if (decoded.scope === 'admin') {
        person = await Admin.findById(decoded.id);
      } else {
        person = await User.findById(decoded.id);
      }

      if (!person) {
        throw new Error('Invalid token');
      }

      if (person.isVerified) {
        return h.response({
          message: 'Account has already been verified'
        })
        .code(400);
      }

      person.isVerified = true;
      person = await person.save();

      return h.response({
        message: 'Account has been verified'
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to verify account', err);
      return h.response({
        message: 'Unable to verify account'
      })
      .code(400);
    }
  }

  @POST('/login', {
    auth: false,
    description: 'Account login',
    tags: ['api'],
    validate: {
      payload: validator.accountLogin
    }
  })
  async accountLogin(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const {
        email,
        password,
        scope
      } = request.payload;

      let person: any = null;

      if (scope === 'admin') {
        person = await Admin.findOne({ email })
          .select('+password')
          .exec();
      } else {
        person = await User.findOne({ email })
        .select('+additional.local.password')
        .select('-addresses')
        .exec();
      }

      if (!person) {
        throw new Error('Invalid email and/or password');
      }

      const passwordMatch = await hash.verify(password, scope === 'admin' ? person.password : person.additional.local.password);

      if (!passwordMatch) {
        throw new Error('Invalid email and/or password');
      }

      if (!person.isVerified) {
        return h.response({
          message: 'Account has not been verified'
        })
        .code(400);
      }

      const loginToken = await token.create({
        id: person.id,
        tyoe: 'account_login',
        scope: person.role && person.role === 'super-admin' ? ['admin', 'super-admin'] : [scope]
      }, process.env.LOGIN_TOKEN_EXPIRY);

      person = person.toObject();
      delete person['additional'];
      delete person['password'];
      person.token = loginToken;

      return h.response({
        [scope]: person
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to login', err);
      return h.response({
        message: 'Invalid email and/or password'
      })
      .code(400);
    }
  }

  @POST('/password_reset', {
    auth: false,
    description: 'User request password reset',
    tags: ['api'],
    validate: {
      payload: validator.userRequestPasswordReset
    }
  })
  async userRequestPasswordReset(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const {
        email,
        previousToken
      } = request.payload;

      let user: any = null;

      if (email) {
        user = await User.findOne({ email });
      } else if (previousToken) {
        const decoded = await token.decode(previousToken);

        if (decoded.type && decoded.type === 'account_password_reset') {
          user = await User.findById(decoded.id);
        }
      }

      if (!user) {
        throw new Error('Invalid email or token');
      }

      if (!user.isVerified) {
        return h.response({
          message: 'Account has not been verified'
        })
        .code(400);
      }

      await request.server.inject({
        url: `/api/emails/password_reset/${user.id}`,
        method: 'POST'
      });

      return h.response({
        message: 'Success'
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to request password reset', err);
      return h.response({
        message: 'Unable to request password reset'
      })
      .code(400);
    }
  }

  @POST('/password_reset/{resetToken}', {
    auth: false,
    description: 'User password reset',
    tags: ['api'],
    validate: {
      params: validator.userPasswordResetParams,
      payload: validator.userPasswordResetPayload
    }
  })
  async userPasswordReset(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const {
        password,
        confirmPassword
      } = request.payload;

      const {
        resetToken
      } = request.params;

      const decoded = await token.decode(resetToken);

      if (!decoded.id || !decoded.type || decoded.type !== 'account_password_reset') {
        logger.error('Invalid reset token', resetToken);
        throw new Error('Invalid reset token');
      }

      const user = await User.findById(decoded.id);

      if (!user) {
        logger.error('Invalid reset token', resetToken);
        throw new Error('Invalid reset token');
      }

      if (password !== confirmPassword) {
        return h.response({
          message: 'Passwords do not match'
        })
        .code(400);
      }

      const hashedPassword = await hash.encrypt(password);
      await User.findByIdAndUpdate(decoded.id, { 'additional.local.password': hashedPassword });

      return h.response({
        message: 'Success'
      })
      .code(200);
    } catch (err) {
      logger.error('Invalid reset token', err);
      return h.response({
        message: 'Invalid reset token'
      })
      .code(400);
    }
  }
}


export default Auth;
