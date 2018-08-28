import { Request, ResponseToolkit, ResponseObject } from 'hapi';
import BaseController from '../helpers/base-controller';
import { GET, POST } from '../decorators/controller';
import logger from '../helpers/logger';


class Util extends BaseController {
  constructor() {
    super('/api/utils');
  }

  @POST('/emails', {
    description: 'Send email',
    tags: ['api']
  })
  async sendEmail(request: any, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const {
        email,
        template,
        data
      } = request.payload;

      // TODO: Send template's email to email address with the data
      return h.response({
        message: 'Email sent'
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to send email', err);
      return h.response({
        message: 'Unable to send email'
      })
      .code(400);
    }
  }
}


export default Util;
