import glob from 'glob';
import IPluginConfig from '../../interfaces/IPluginConfig';


const pluginsConfig: any = {};

glob.sync('*.js', {
  cwd: __dirname,
  ignore: 'index.js'
})
  .forEach((file) => {
    const config: IPluginConfig = require(`./${file}`).default;
    pluginsConfig[`${config.name}`] = config.options;
  });


export default pluginsConfig;
