import { Request, ResponseToolkit, ResponseObject } from 'hapi';
import BaseController from '../helpers/base-controller';
import { GET } from '../decorators/controller';


class Test extends BaseController {
  constructor() {
    super('/api/test');
  }

  @GET('/hello', {
    description: 'Test Route',
    tags: ['api'],
    auth: false
  })
  async hello(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    return h.response({
      message: 'Hello world!'
    });
  }
}


export default Test;
