/**
 * @license
 */
export const environment = {
  production: true,
  googleApiKey: '',
  //MARKETPLACE | BTB | STANDARD
  mode: 'STANDARD',
  apiUrl: 'http://15.223.64.6:9090/api',
  shippingApi: 'http://15.223.64.6:9091/api',
  client: {
      language: {
          default: 'en',
          array: [
              'en',
              'es',
              'fr',
              'ru',
              'ar'
          ],
      },
  }
};
