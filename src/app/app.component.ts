import {Component, inject} from '@angular/core';
import {Auth0Service} from './Core/services/Auth0/auth0.service';
import {Router, RouterOutlet} from '@angular/router';
import {environment as ENV} from '../environments/environment'
import {GoogleSheetsService} from './Core/services/GoogleSheets/google-sheets.service';

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
  _googleSheetsService: GoogleSheetsService = inject(GoogleSheetsService);
  result : any;
  Role !: string;
  spreadsheetId: string = '1SVpmvlwOZ2bLvX4ofXBEaNPcyYiKR895xNeLDT3ul_4'; // You'll need to set this to your actual spreadsheet ID
  error: string | null = null;

  Token ?: string;

  logout(): void {
    this._Auth0Service.authService?.logout({
      logoutParams : {
        redirect_uri : `${ENV.auth.authorizationParams.redirect_uri}`,
      }
    });
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
        this.fetchGoogleApiToken();
      }
    });

  }


  fetchGoogleApiToken() {
    console.log('Attempting to get the Access Token...');

    // The getAccessTokenSilently() method returns an Observable
    this._Auth0Service.authService?.getAccessTokenSilently().subscribe({
      next: (token) => {
        // SUCCESS!
        // This 'token' is the string you need to send to the Google Sheets API.
        console.log('Successfully retrieved Access Token' , token);
        // Example: Read data from a spreadsheet
        this.Token = token;
        this.readSpreadsheetData(token);
      },
      error: (err) => {
        // This can happen if the user needs to log in again,
        // or if there is a configuration issue.
        console.error('Error getting Access Token:', err);
        this.error = 'Failed to get access token. Please try logging in again.';
      }
    });
  }

  // Example method to read data from a spreadsheet
  readSpreadsheetData(accessToken: string) {
    if (!this.spreadsheetId) {
      this.error = 'Spreadsheet ID is not set';
      return;
    }

    this._googleSheetsService.readSheet(this.spreadsheetId, 'A1:Z10000', accessToken);
  }
  //
  // // Example method to write data to a spreadsheet
  // writeSpreadsheetData(accessToken: string, data: any[][]) {
  //   if (!this.spreadsheetId) {
  //     this.error = 'Spreadsheet ID is not set';
  //     return;
  //   }
  //
  //   this._googleSheetsService.writeSheet(this.spreadsheetId, 'A1', data, accessToken)
  //     .subscribe({
  //       next: (response) => {
  //         console.log('Data written successfully:', response);
  //         this.error = null;
  //       },
  //       error: (error) => {
  //         console.error('Error writing to spreadsheet:', error);
  //         this.error = 'Failed to write to spreadsheet. Please check your permissions and try again.';
  //       }
  //     });
  // }

}
