import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from "@angular/common/http";
import {routes} from './app.routes';
import {provideFirebaseServices} from "./firebase.providers";
import {provideEnvironmentNgxMask} from "ngx-mask";
import {LeafletModule} from "@bluehalo/ngx-leaflet";
import {AuthService} from "./shared/data-access/auth.service";


export function initAuth() {
  const authService = inject(AuthService);
  return authService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => initAuth()),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseServices(),
    provideEnvironmentNgxMask(),
    importProvidersFrom(LeafletModule),
    provideHttpClient(),
  ]
};
