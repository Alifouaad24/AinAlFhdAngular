import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'; // ضروري لتشغيل التوستر
import { Animation } from 'jquery';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimations(), // required animations providers
    provideToastr({
      closeButton: true,
      progressBar: true,
      timeOut: 2000
    }),
  
  ]
};
