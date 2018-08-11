import * as jwt from 'jsonwebtoken';
import Admin from '../models/admin';
import User from '../models/user';
import logger from '../helpers/logger';

const {
  JWT_ALGORITHM,
  JWT_SECRET
} = process.env;


export function create(data: any, expiresIn?: string | number): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    const options: jwt.SignOptions = {
      algorithm: JWT_ALGORITHM
    };

    if (expiresIn) {
      options.expiresIn = expiresIn;
    }

    jwt.sign(data, JWT_SECRET, options, (err: Error, encoded: string) => {
      if (err) {
        logger.error('Unable to create jwt token', err);
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
}

export async function validate(decoded: any, request: any): Promise<object> {
  try {
    let person: any = null;

    if (decoded.scope === 'admin') {
      person = await Admin.findById(decoded.id);
    } else {
      person = await User.findById(decoded.id);
    }

    if (!person) {
      logger.error('Invalid user', decoded, request.auth.token);
      throw new Error('Invalid token');
    }

    return { isValid: true };
  } catch (err) {
    logger.error('Invalid jwt token', err, request.auth.token);
    return { isValid: false };
  }
}
