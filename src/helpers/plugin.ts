import * as Hapi from 'hapi';
import pluginsConfig from '../configs/plugins';
import Logger from './logger';
const GoodWinston = require('good-winston');


class Plugin {
  private _server: Hapi.Server;

  constructor(server: Hapi.Server) {
    this._server = server;
  }

  private async regStatus(): Promise<Error | any> {
    await this.register('Status Monitor', {
      plugin: require('hapijs-status-monitor'),
      options: pluginsConfig.status
    });
  }

  private async regInert(): Promise<Error | any> {
    await this.register('Inert', require('inert'));
  }

  private async regVision(): Promise<Error | any> {
    await this.register('Vision', require('vision'));
  }

  private async regSwagger(): Promise<Error | any> {
    await this.regInert();
    await this.regVision();

    await this.register('Swagger', {
      plugin: require('hapi-swagger'),
      options: pluginsConfig.swagger
    });
  }

  private async regBoomDecorators(): Promise<Error | any> {
    await this.register('Boom Decorators', require('hapi-boom-decorators'));
  }

  private async regAuthJwt(): Promise<Error | any> {
    await this.register('JWT Auth', require('hapi-auth-jwt2'));
  }

  private async regGood(): Promise<Error | any> {
    const goodWinstonStream = new GoodWinston({
      winston: Logger,
      format: 'YYYY-MM-DDThh:mm:ss:SSS',
      utc: false,
      color: false,
      level: {
        error: 'error',
        other: 'debug',
        ops: 'debug',
        response: 'info',
        request: 'info'
      }
    });

    await this.register('Good', {
      plugin: require('good'),
      options: {
        reporters: {
          winston: [goodWinstonStream]
        }
      }
    });
  }

  private register(name: string, plugin: any): Promise<Error | any> {
    return new Promise(async (resolve, reject) => {
      try {
        Logger.info(`Plugins: Registering ${name}`);
        await this._server.register(plugin);
        Logger.info(`Plugins: Successfully registered ${name}`);
        resolve();
      } catch (err) {
        Logger.error(`Plugins: Unable to register ${name}`, err);
        reject(err);
      }
    });
  }

  public async registerAll(): Promise<Error | any> {
    await this.regGood();
    await this.regStatus();
    await this.regSwagger();
    await this.regBoomDecorators();
    await this.regAuthJwt();
  }
}


export default Plugin;
