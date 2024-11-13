import Application from '@ioc:Adonis/Core/Application';
import { I18nConfig } from '@ioc:Adonis/Addons/I18n';

const i18nConfig: I18nConfig = {
  translationsFormat: 'icu',

  defaultLocale: 'en',

  provideValidatorMessages: true,

  loaders: {
    fs: {
      enabled: true,
      location: Application.resourcesPath('lang'),
    },
  },
};

export default i18nConfig;
