// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: "https://localhost:7168/api",
  azureAD: {
    clientId: "c2f0def7-e914-4b53-bdb7-46465346ff0b",
    authority: 'https://login.microsoftonline.com/940a914e-05a6-4807-8e22-374cf7a71990',
    redirectUri: 'http://localhost:4200/'
  },
  graphUrl: 'https://graph.microsoft.com/v1.0/me',
  functionsUrl: 'http://localhost:7298/api',
  functionsKey: 'key',
  performTransactionUrl: 'https://prod-219.westeurope.logic.azure.com:443/workflows/02b6970546f94559952bce1025a537a2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AM8kH3ODtcKS3zg2k0krmQBWgkpPWZkuYZ04pkJcfXY'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
