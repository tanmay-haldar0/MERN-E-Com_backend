import mugConfig from '../assets/templates/mug/config.json';
import mobileCoverConfig from '../assets/templates/mobile_cover/config.json';

export const useTemplate = (templateName) => {
  switch (templateName) {
    case 'mug':
      return {
        config: mugConfig,
        modelPath: mugConfig.modelPath,
      };
    case 'mobile_cover':
      return {
        config: mobileCoverConfig,
        modelPath: mobileCoverConfig.modelPath,
      };
    default:
      throw new Error('Template not found');
  }
};
