import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideAuth0} from '@auth0/auth0-angular';
import {environment as ENV} from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAuth0({
      domain: `${ENV.auth.domain}`,
      clientId: `${ENV.auth.clientId}`,
      authorizationParams: {
        redirect_uri: `${ENV.auth.authorizationParams.redirect_uri}`,
        audience: `${ENV.auth.authorizationParams.audience}`,
        scope: `${ENV.auth.authorizationParams.scope}`,
      },
      useRefreshTokens: true,
      cacheLocation: "localstorage",
    }),
  ]
};
