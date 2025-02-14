import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';

import { routes } from './app.routes';
import {environment} from '../environments/environments';
const app = initializeApp(environment.firebase);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
