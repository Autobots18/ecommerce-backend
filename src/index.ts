import 'dotenv/config';
import Server from './server';


const server = new Server();

(async () => {
  await server.start();
})();


export default server;
