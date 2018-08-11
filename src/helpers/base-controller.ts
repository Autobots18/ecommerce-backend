import IRoute from '../interfaces/IRoute';


class BaseController {
  private _basePath: string;
  private _routes: IRoute[];

  constructor(basePath?: string) {
    this._basePath = basePath || '/';
  }

  public get routes(): IRoute[] {
    const routes: IRoute[] = this._routes || [];
    routes.map((_route: IRoute) => {
      let path = this._basePath + _route.path;
      path = path.split('//').join('/');
      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      _route.path = path;
      return _route;
    });
    return this._routes;
  }

  public addRoute(route: IRoute): void {
    if (!Array.isArray(this._routes)) {
      this._routes = [];
    }
    this._routes.push(route);
  }
}


export default BaseController;
