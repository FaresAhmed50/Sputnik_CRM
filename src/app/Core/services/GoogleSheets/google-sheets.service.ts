import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, from, BehaviorSubject, Subscription} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';
import type { gapi } from 'gapi-script';
import {response} from 'express';


// declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private readonly API_KEY: string = 'AIzaSyCtovUnRS5j-WfZ4JNiQVkJHRYANifAeJo';
  private readonly DISCOVERY_DOC: string = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
  private readonly SCOPES: string = 'https://www.googleapis.com/auth/spreadsheets';
  private gapiInitialized : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private platformID: object = inject(PLATFORM_ID);
  private gapi!: typeof gapi;
  private loadGapiInsideDOM: any;


  private isBrowser : boolean = isPlatformBrowser(this.platformID);
  constructor(private http: HttpClient) {
    if(this.isBrowser){
      import('gapi-script').then((api) => {
        this.gapi = api.gapi as typeof gapi;
        this.loadGapiInsideDOM = api.loadGapiInsideDOM;
        this.initializeGapi();
        console.log(this.gapi);
      });
    }
  }

  private initializeGapi(): void {
    if (typeof this.gapi === 'undefined') {
      console.error('Google API client library not loaded');
      return;
    }
    this.loadGapiInsideDOM().then(() => {
      this.gapi.load('client:auth2', () => {
        this.gapi.client
          .init({
            apiKey: this.API_KEY,
            clientId: '159211383517-edp9rr7pr1fdduno9444bcq21rlqp6f5.apps.googleusercontent.com',
            discoveryDocs: [this.DISCOVERY_DOC],
            scope: this.SCOPES,
          })
          .then(() => {
            console.log('GAPI Initialized');
            this.gapiInitialized.next(true);
          })
          .catch((err : any) => {
            console.error('GAPI Init Error', err);
          });
      })
    });
  }

  private waitForGapi(): Observable<boolean | void> {
    return this.gapiInitialized.pipe(
      switchMap((initialized) => {
        return initialized ? from(Promise.resolve()) : this.gapiInitialized.asObservable();
      })
    );
  }


  // Read data from a specific spreadsheet
  readSheet(spreadsheetId: string, range: string, accessToken: string): Subscription {
    return this.waitForGapi().subscribe({
      next: () => {
        this.gapi?.client.request({
          path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet`,
          method: 'GET',
          params: {
            ranges: 'sheet1!A1:Z100',
          },
          headers: {
            accessToken: `Bearer ${accessToken}`,
          }
        }).then( (response : any) => {
          console.log(response);
        }).catch((err : any) => {
          console.log(err);
        })
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  // Write data to a specific spreadsheet
  // writeSheet(spreadsheetId: string, range: string, values: any[][], accessToken: string): Observable<any> {
  //   return this.waitForGapi().pipe(
  //     switchMap(() => from(gapi.client.sheets.spreadsheets.values.update({
  //       spreadsheetId: spreadsheetId,
  //       range: range,
  //       valueInputOption: 'RAW',
  //       resource: {
  //         values: values
  //       },
  //       access_token: accessToken
  //     })))
  //   );
  // }
  //
  // // Append data to a specific spreadsheet
  // appendSheet(spreadsheetId: string, range: string, values: any[][], accessToken: string): Observable<any> {
  //   return this.waitForGapi().pipe(
  //     switchMap(() => from(gapi.client.sheets.spreadsheets.values.append({
  //       spreadsheetId: spreadsheetId,
  //       range: range,
  //       valueInputOption: 'RAW',
  //       resource: {
  //         values: values
  //       },
  //       access_token: accessToken
  //     })))
  //   );
  // }
  //
  // // Create a new spreadsheet
  // createSpreadsheet(title: string, accessToken: string): Observable<any> {
  //   return this.waitForGapi().pipe(
  //     switchMap(() => from(gapi.client.sheets.spreadsheets.create({
  //       resource: {
  //         properties: {
  //           title: title
  //         }
  //       },
  //       access_token: accessToken
  //     })))
  //   );
  // }
}
