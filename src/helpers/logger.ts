import {
  Logger,
  transports as Transports,
  LoggerInstance,
  DailyRotateFileTransportInstance,
  ConsoleTransportInstance,
  config
} from 'winston';
import 'winston-daily-rotate-file';
import moment from 'moment';


class AppLogger {
  private _logger: LoggerInstance;
  private _rotateFileErrorTransport: DailyRotateFileTransportInstance;
  private _rotateFileInfoTransport: DailyRotateFileTransportInstance;
  private _rotateFileWarnTransport: DailyRotateFileTransportInstance;
  private _rotateFileVerboseTransport: DailyRotateFileTransportInstance;
  private _rotateFileAllTransport: DailyRotateFileTransportInstance;
  private _consoleTransport: ConsoleTransportInstance;

  constructor() {
    this._rotateFileErrorTransport = new Transports.DailyRotateFile({
      name: 'file.error',
      prettyPrint: true,
      level: 'error',
      datePattern: 'YYYY-MM-DDTHH',
      dirname: './logs/error',
      filename: '%DATE%.log',
      prepend: true,
      timestamp: () => moment().format('YYYY-MM-DDThh:mm:ss:SSS')
    });

    this._rotateFileInfoTransport = new Transports.DailyRotateFile({
      name: 'file.info',
      prettyPrint: true,
      level: 'info',
      datePattern: 'YYYY-MM-DDTHH',
      dirname: './logs/info',
      filename: '%DATE%.log',
      prepend: true,
      timestamp: () => moment().format('YYYY-MM-DDThh:mm:ss:SSS')
    });

    this._rotateFileWarnTransport = new Transports.DailyRotateFile({
      name: 'file.warn',
      prettyPrint: true,
      level: 'warn',
      datePattern: 'YYYY-MM-DDTHH',
      dirname: './logs/warn',
      filename: '%DATE%.log',
      prepend: true,
      timestamp: () => moment().format('YYYY-MM-DDThh:mm:ss:SSS')
    });

    this._rotateFileVerboseTransport = new Transports.DailyRotateFile({
      name: 'file.verbose',
      prettyPrint: true,
      level: 'verbose',
      datePattern: 'YYYY-MM-DDTHH',
      dirname: './logs/verbose',
      filename: '%DATE%.log',
      prepend: true,
      timestamp: () => moment().format('YYYY-MM-DDThh:mm:ss:SSS')
    });

    this._rotateFileAllTransport = new Transports.DailyRotateFile({
      name: 'file.all',
      prettyPrint: true,
      level: 'silly',
      datePattern: 'YYYY-MM-DDTHH',
      dirname: './logs/all',
      filename: '%DATE%.log',
      prepend: true,
      timestamp: () => moment().format('YYYY-MM-DDThh:mm:ss:SSS')
    });

    this._consoleTransport = new Transports.Console({
      colorize: 'all',
      prettyPrint: true,
      level: 'info',
      timestamp: () => moment().format('YYYY-MM-DDThh:mm:ss:SSS')
    });

    this._logger = new Logger({
      levels: config.npm.levels,
      transports: [
        this._rotateFileErrorTransport,
        this._rotateFileInfoTransport,
        this._rotateFileWarnTransport,
        this._rotateFileVerboseTransport,
        this._rotateFileAllTransport,
        this._consoleTransport
      ]
    });
  }

  public getLogger(): LoggerInstance {
    return this._logger;
  }
}


export default new AppLogger().getLogger();
