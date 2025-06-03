import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {environment} from './environments/environment'
import { registerLicense } from '@syncfusion/ej2-base';



registerLicense(`${environment.syncfusionKey}`);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
