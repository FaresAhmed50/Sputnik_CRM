import {Component, inject} from '@angular/core';
import {Auth0Service} from './Core/services/Auth0/auth0.service';
import {Router, RouterOutlet} from '@angular/router';
import {first} from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Sputnik-CRM';

  _Auth0Service : Auth0Service = inject(Auth0Service);
  _router :Router = inject(Router);
  result : any;
  Role !: string;

  logout(): void {
    this._Auth0Service.authService?.logout();
  }

  login(): any {
    this._Auth0Service.authService?.loginWithRedirect();
  }


  ngOnInit(): void {

    this._Auth0Service.authService?.user$.subscribe(user => {
      console.log(user?.['Role'].role);
      this.Role = user?.['Role'].role;
    });

    this._Auth0Service.authService?.isAuthenticated$.subscribe(isAuthenticated => {
      console.log(this.Role);
      if (isAuthenticated) {
        this._router.navigate(['/home']);
      }
    });
  }



}
