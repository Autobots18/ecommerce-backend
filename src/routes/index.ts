import * as glob from 'glob';
import BaseController from '../helpers/base-controller';
import IRoute from '../interfaces/IRoute';


const routes: IRoute[] = [];

glob.sync('../controllers/**/*.js', {
  cwd: __dirname
})
  .forEach((file: string) => {
    const Controller = require(`./${file}`).default;
    const controller = new Controller();
    const controllerRoutes: IRoute[] = controller.routes;
    routes.push(...controllerRoutes);
  });


export default routes;
