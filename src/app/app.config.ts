import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideAuth0} from '@auth0/auth0-angular';
import {environment as ENV} from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideAuth0({
      domain: `${ENV.auth.domain}`,
      clientId: `${ENV.auth.clientId}`,
      authorizationParams: {
        redirect_uri: 'http://localhost:4200/home',
        audience: 'https://dev-1dha8qt8zf60zyxc.us.auth0.com/api/v2/',
        scope: 'openid profile email',
      },
      useRefreshTokens: true,
      cacheLocation: "localstorage",
    }),
  ]
};
