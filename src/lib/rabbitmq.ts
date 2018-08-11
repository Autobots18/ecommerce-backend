import * as amqplib from 'amqplib';
import { assertConnExists } from '../decorators/rabbitmq';


class RabbitMQ {
  private _conn: amqplib.Connection;
  private _rabbitMqURL: string;
  private _socketOptions: any;

  constructor(rabbitMqURL: string, socketOptions?: any) {
    this._conn = null;
    this._rabbitMqURL = rabbitMqURL;
    this._socketOptions = socketOptions;
  }

  public connect(): Promise<Error | any> {
    return new Promise((resolve, reject) => {
      amqplib.connect(this._rabbitMqURL, this._socketOptions)
        .then((conn: amqplib.Connection) => {
          this._conn = conn;
          return resolve();
        })
        .catch((err: Error) => reject(err));
    });
  }

  public get conn(): amqplib.Connection {
    return this._conn;
  }

  @assertConnExists
  public createChannel(): Promise<Error | amqplib.Channel> {
    return new Promise((resolve, reject) => {
      this._conn.createChannel()
        .then((ch: amqplib.Channel) => resolve(ch))
        .catch((err: Error) => reject(err));
    });
  }

  @assertConnExists
  public createConfirmChannel(): Promise<Error | amqplib.ConfirmChannel> {
    return new Promise((resolve, reject) => {
      this._conn.createConfirmChannel()
        .then((ch: amqplib.ConfirmChannel) => resolve(ch))
        .catch((err: Error) => reject(err));
    });
  }
}


export default RabbitMQ;
