export const environment = {
  production: true,
  baseUrl: "https://bohdan-wallet-api.azurewebsites.net/api",
  azureAD: {
    clientId: "c2f0def7-e914-4b53-bdb7-46465346ff0b",
    authority: 'https://login.microsoftonline.com/940a914e-05a6-4807-8e22-374cf7a71990',
    redirectUri: 'https://mango-hill-0cfe7f703.1.azurestaticapps.net/'
  },
  graphUrl: 'https://graph.microsoft.com/v1.0/me',
  functionsUrl: 'https://azurepracticecreatewalletfunction20220713112026.azurewebsites.net/api',
  functionsKey: 'xirPwkfpgFSbBWuh5fqrVdFFcg2_zg8tBHiEpyOaDkwCAzFuRcZe6Q==',
  performTransactionUrl: 'https://prod-219.westeurope.logic.azure.com:443/workflows/02b6970546f94559952bce1025a537a2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AM8kH3ODtcKS3zg2k0krmQBWgkpPWZkuYZ04pkJcfXY'
};
