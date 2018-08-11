import { Server } from 'hapi';
import socketIO from 'socket.io';


class WebSocket {
  private _io: socketIO.Server;

  public start(server: Server): void {
    this._io = socketIO(server.listener);
  }

  public get io(): socketIO.Server {
    return this._io;
  }

  public of(nsp: string): socketIO.Namespace {
    return this._io.of(nsp);
  }

  public on(event: string, listener: Function): void {
    this._io.on(event, listener);
  }

  public emit(event: string, data: any): void {
    this._io.emit(event, data);
  }

  public to(room: string): socketIO.Namespace {
    return this._io.to(room);
  }

  public in(room: string): socketIO.Namespace {
    return this.to(room);
  }

  public emitTo(room: string, event: string, listener: Function): void {
    this.to(room).emit(event, listener);
  }

  public emitIn(room: string, event: string, listener: Function): void {
    this.to(room).emit(event, listener);
  }
}


export default WebSocket;
