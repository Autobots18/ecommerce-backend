import IPluginConfig from '../../interfaces/IPluginConfig';


const config: IPluginConfig = {
  name: 'swagger',
  options: {
    documentationPath: '/docs',
    jsonEditor: true,
    info: {
      title: 'Ecommerce Project API Documentation',
      version: 'v1.0.0',
      contact: {
        name: 'Unilag Computer Engineering Class of 2018'
      }
    },
    pathPrefixSize: 2,
    sortEndpoints: 'ordered'
  }
};


export default config;
