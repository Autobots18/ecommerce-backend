import IPluginConfig from '../../interfaces/IPluginConfig';


const config: IPluginConfig = {
  name: 'status',
  options: {
    path: '/status',
    title: 'APP Monitor',
    routeConfig: {
      auth: false,
    },
  }
};


export default config;
