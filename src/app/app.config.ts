import {
  ApplicationConfig,
  importProvidersFrom, inject, provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideEnvironmentNgxMask} from "ngx-mask";
import {apiInterceptor} from "./shared/interceptors/api.interceptor";

import {LeafletModule} from "@bluehalo/ngx-leaflet";

import {routes} from './app.routes';
import {AuthService} from "./shared/data-access/auth.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideEnvironmentNgxMask(),
    importProvidersFrom(LeafletModule),
    provideHttpClient(withInterceptors([apiInterceptor])),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.init();
    })
  ]
};
