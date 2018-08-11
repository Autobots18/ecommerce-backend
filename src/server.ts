import * as Hapi from 'hapi';
import mongoose from 'mongoose';
import Logger from './helpers/logger';
import Plugin from './helpers/plugin';
import webSocket from './utils/web-socket';
import rabbitMQ from './utils/rabbitmq';
import routes from './routes';
import * as token from './utils/token';


class Server {
  private _server: Hapi.Server;

  constructor() {
    this._server = new Hapi.Server({
      host: process.env.HOST,
      port: process.env.PORT,
      routes: {
        cors: true
      }
    });
  }

  private async initDatabase() {
    try {
      Logger.info('Intializing database...');
      await mongoose.connect(process.env.MONGODB_URL);
      Logger.info('Database initialization successful.');
    } catch (err) {
      Logger.error('Database initialization failed.', err);
      throw err;
    }
  }

  private async initPlugins() {
    try {
      Logger.info('Intializing plugins...');
      await new Plugin(this._server).registerAll();
      Logger.info('Plugins initialization successful.');
    } catch (err) {
      Logger.error('Plugins initialization failed.', err);
      throw err;
    }
  }

  private async initAuth() {
    try {
      Logger.info('Intializing authentication...');
      this._server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET,
        validate: token.validate,
        verifyOptions: {
          algorithms: [process.env.JWT_ALGORITHM]
        }
      });
      this._server.auth.default('jwt');
      Logger.info('Authentication initialization successful.');
    } catch (err) {
      Logger.error('Authentication initialization failed.', err);
      throw err;
    }
  }

  private async initElasticsearch() {
    try {
      Logger.info('Intializing Elasticsearch...');
      //
      Logger.info('Elasticsearch initialization successful.');
    } catch (err) {
      Logger.error('Elasticsearch initialization failed.', err);
      throw err;
    }
  }

  private async initRabbitMQ() {
    try {
      Logger.info('Intializing RabbitMQ...');
      await rabbitMQ.connect();
      Logger.info('RabbitMQ initialization successful.');
    } catch (err) {
      Logger.error('RabbitMQ initialization failed.', err);
      throw err;
    }
  }

  private async initWebsocket() {
    try {
      Logger.info('Intializing websocket...');
      webSocket.start(this._server);
      Logger.info('Websocket initialization successful.');
    } catch (err) {
      Logger.error('Websocket initialization failed.', err);
      throw err;
    }
  }

  public async initRoutes() {
    try {
      Logger.info('Intializing routes...');
      this._server.route(routes);
      Logger.info('Routes initialization successful.');
    } catch (err) {
      Logger.error('Routes initialization failed.', err);
      throw err;
    }
  }

  private async initAll() {
    try {
      Logger.info('Starting initialization...');
      await this.initPlugins();
      await this.initDatabase();
      await this.initAuth();
      // await this.initElasticsearch();
      // await this.initRabbitMQ();
      await this.initWebsocket();
      await this.initRoutes();
      Logger.info('All initializations successful.');
    } catch (err) {
      Logger.error('Initialization failure.', err);
      throw err;
    }
  }

  public async start() {
    try {
      await this.initAll();
      Logger.info('Starting server...');
      await this._server.start();
      Logger.info(`Server running at ${this._server.info.uri}`);
    } catch (err) {
      Logger.error('Unable to start server', err);
      process.exit(1);
    }
  }
}


export default Server;
