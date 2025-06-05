import { Injectable , inject , PLATFORM_ID  } from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {AuthService} from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {

  private platformID = inject(PLATFORM_ID);
  private isBrowser : boolean = isPlatformBrowser(this.platformID);
  authService?: AuthService | null ;

  constructor() {
    if(this.isBrowser){
      try {
        this.authService = inject(AuthService);
      } catch (error) {
        console.warn('AuthService not available:', error);
      }
    }
  }
}
