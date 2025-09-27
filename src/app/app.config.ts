import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideHighcharts } from 'highcharts-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHighcharts(),

    // Material Date Adapter
    // {
    //   provide: DateAdapter,
    //   useClass: LuxonDateAdapter,
    // },
    // {
    //   provide: MAT_DATE_FORMATS,
    //   useValue: {
    //     parse: {
    //       dateInput: 'D',
    //     },
    //     display: {
    //       dateInput: 'DDD',
    //       monthYearLabel: 'LLL yyyy',
    //       dateA11yLabel: 'DD',
    //       monthYearA11yLabel: 'LLLL yyyy',
    //     },
    //   },
    // },
  ],
};
