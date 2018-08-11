import { RouteOptions } from 'hapi';


interface IRouteOption extends RouteOptions {
  description: string;
  tags: string[];
}


export default IRouteOption;
