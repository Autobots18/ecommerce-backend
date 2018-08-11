import IPluginConfig from '../../interfaces/IPluginConfig';


const config: IPluginConfig = {
  name: 'swagger',
  options: {
    basePath: '/api/',
    documentationPath: '/docs',
    jsonEditor: true,
    info: {
      title: 'Ecommerce Project API Documentation',
      version: 'v1.0.0',
      contact: {
        name: 'Unilag Computer Engineering Class of 2018'
      }
    },
    grouping: 'tags',
    sortEndpoints: 'ordered'
  }
};


export default config;
