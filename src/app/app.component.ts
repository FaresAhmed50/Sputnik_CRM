import { Component } from '@angular/core';
import { GridModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars'

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [GridModule, PagerModule , CalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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
