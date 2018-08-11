import { ServerRoute, Lifecycle } from 'hapi';
import IRouteOption from './IRouteOption';


interface IRoute extends ServerRoute {
  handler: Lifecycle.Method;
  options?: IRouteOption;
}


export default IRoute;
