import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';

import {routes} from './app.routes';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
  initializeFirestore,
  provideFirestore
} from '@angular/fire/firestore';
import {environment} from "../environments/environment";
import {provideHttpClient} from "@angular/common/http";
import {provideRouter} from "@angular/router";
import {connectFunctionsEmulator, getFunctions, provideFunctions} from "@angular/fire/functions";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      let firestore: Firestore;
      if (environment.useEmulators) {
        firestore = initializeFirestore(getApp(), {
          experimentalForceLongPolling: true,
        });
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      } else {
        firestore = getFirestore();
      }
      return firestore;
    }),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        console.log('uzywam emulatora')
        connectFunctionsEmulator(functions, 'localhost', 5001)
      }
      console.log('uzywam emulatora')
      return functions;
    }),

    provideRouter(routes),
    provideHttpClient(),
  ]
};
