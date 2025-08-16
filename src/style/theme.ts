import { getMovistarSkin, ThemeConfig } from '@telefonica/mistica';

const theme: ThemeConfig = {
  skin: getMovistarSkin(),
  colorScheme: 'light',
  i18n: {
    locale: 'pt-BR',
    phoneNumberFormattingRegionCode: 'BR',
  },
};

export { theme };