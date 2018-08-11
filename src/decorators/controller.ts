import { Lifecycle } from 'hapi';
import IRouteOption from '../interfaces/IRouteOption';
import IRoute from '../interfaces/IRoute';


function addRoute(
  target: any,
  handler: Lifecycle.Method,
  path: string,
  method: string | string[],
  options?: IRouteOption
) {
  const route: IRoute = {
    method,
    path,
    handler,
    options
  };

  target.addRoute(route);
}

export function ROUTE(path: string, method: string | string[], options?: IRouteOption) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    addRoute(target, descriptor.value, path, method, options);
  };
}

export function GET(path: string, options?: IRouteOption) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    addRoute(target, descriptor.value, path, 'GET', options);
  };
}

export function POST(path: string, options?: IRouteOption) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    addRoute(target, descriptor.value, path, 'POST', options);
  };
}

export function PUT(path: string, options?: IRouteOption) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    addRoute(target, descriptor.value, path, 'PUT', options);
  };
}

export function PATCH(path: string, options?: IRouteOption) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    addRoute(target, descriptor.value, path, 'PATCH', options);
  };
}

export function DELETE(path: string, options?: IRouteOption) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    addRoute(target, descriptor.value, path, 'DELETE', options);
  };
}
