import * as bcrypt from 'bcrypt';
import logger from '../helpers/logger';

const BCRYPT_SALT_ROUNDS: number = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);


export function encrypt(data: any): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(data, BCRYPT_SALT_ROUNDS)
      .then((encrypted: string) => resolve(encrypted))
      .catch((err: Error) => {
        logger.error('Unable to create bcrypt hash', err);
        reject(err);
      });
  });
}

export function verify(data: any, encrypted: string): Promise<boolean | Error> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(data, encrypted)
      .then((isValid: boolean) => resolve(isValid))
      .catch((err: Error) => {
        logger.error('Unable to verify bcrypt hash', err);
        reject(err);
      });
  });
}
