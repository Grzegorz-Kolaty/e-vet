import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
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
  ]
};

// import { ApplicationConfig, InjectionToken } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { initializeApp } from 'firebase/app';
// import {
//   Firestore,
//   initializeFirestore,
//   connectFirestoreEmulator,
//   getFirestore,
// } from 'firebase/firestore';
// import { getAuth, connectAuthEmulator } from 'firebase/auth';
// import { environment } from '../environments/environment';
//
// import { routes } from './app.routes';
// import { provideAnimations } from '@angular/platform-browser/animations';
//
// const app = initializeApp(environment.firebase);
//
// export const AUTH = new InjectionToken('Firebase auth', {
//   providedIn: 'root',
//   factory: () => {
//     const auth = getAuth();
//     if (environment.useEmulators) {
//       connectAuthEmulator(auth, 'http://localhost:9099', {
//         disableWarnings: true,
//       });
//     }
//     return auth;
//   },
// });
//
// export const FIRESTORE = new InjectionToken('Firebase firestore', {
//   providedIn: 'root',
//   factory: () => {
//     let firestore: Firestore;
//     if (environment.useEmulators) {
//       firestore = initializeFirestore(app, {});
//       connectFirestoreEmulator(firestore, 'localhost', 8080);
//     } else {
//       firestore = getFirestore();
//     }
//     return firestore;
//   },
// });
//
//
// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideAnimations()],
// };
//
