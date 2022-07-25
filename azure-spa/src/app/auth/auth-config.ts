import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.azureAD.clientId,
    authority: environment.azureAD.authority,
    redirectUri: environment.azureAD.redirectUri,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: isIE,
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
}

export const protectedResources = [
  {
    endpoint: `${environment.baseUrl}`,
    scopes: ['api://ab9b529d-898d-428a-8eb8-eec1a488a4da/userAccess']
  },
  {
    endpoint: `${environment.baseUrl}/userEmails`,
    scopes: ['api://ab9b529d-898d-428a-8eb8-eec1a488a4da/userAccess']
  },
  {
    endpoint: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['user.read']
  },
  // {
  //   endpoint: environment.createWalletUrl,
  //   scopes: ['user.read']
  // }
]

export const loginRequest = {
  scopes: []
};
