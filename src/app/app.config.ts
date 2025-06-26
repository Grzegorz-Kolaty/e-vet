import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from "@angular/common/http";
import {routes} from './app.routes';
import {provideFirebaseServices} from "./firebase.providers";
import {provideEnvironmentNgxMask} from "ngx-mask";
import {LeafletModule} from "@bluehalo/ngx-leaflet";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseServices(),
    provideEnvironmentNgxMask(),
    importProvidersFrom(LeafletModule),
    provideHttpClient()
  ]
};
