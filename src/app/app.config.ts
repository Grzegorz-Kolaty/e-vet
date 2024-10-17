// import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
//
// import {routes} from './app.routes';
// import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
// import {connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
// import {
//   connectFirestoreEmulator,
//   Firestore,
//   getFirestore,
//   initializeFirestore,
//   provideFirestore
// } from '@angular/fire/firestore';
// import {environment} from "../environments/environment";
// import {provideHttpClient} from "@angular/common/http";
// import {provideRouter} from "@angular/router";
// import {connectFunctionsEmulator, getFunctions, provideFunctions} from "@angular/fire/functions";
//
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({eventCoalescing: true}),
//     provideFirebaseApp(() => initializeApp(environment.firebase)),
//     provideFirestore(() => {
//       const firestore = getFirestore();
//       // let firestore: Firestore;
//       if (environment.useEmulators) {
//         // firestore = initializeFirestore(getApp(), {
//         //   experimentalForceLongPolling: true,
//         // });
//         connectFirestoreEmulator(getFirestore(), 'localhost', 8080);
//         console.log('firestore useemulators', getFirestore());
//       }
//       // else {
//       //   firestore = getFirestore();
//       //   console.log('firestore NOT useemulators', firestore);
//       // }
//       return firestore;
//     }),
//
//     provideAuth(() => {
//       const auth = getAuth();
//       if (environment.useEmulators) {
//         connectAuthEmulator(getAuth(), 'http://localhost:9099', {
//           disableWarnings: true,
//         });
//       }
//       return auth;
//     }),
//
//     provideFunctions(() => {
//       const functions = getFunctions(getApp());
//       if (environment.useEmulators) {
//         console.log('uzywam emulatora w appconfigu:', functions)
//         connectFunctionsEmulator(functions, 'localhost', 5001)
//       }
//       console.log('nie uzywam emulatora w appconfigu:')
//       return functions;
//     }),
//
//     provideRouter(routes),
//     provideHttpClient(),
//   ]
// };


import { ApplicationConfig, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, Firestore, getFirestore, initializeFirestore, } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from "@angular/common/http";

const app = initializeApp(environment.firebase);

export const AUTH = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth();
    if (environment.useEmulators) {
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });
    }
    return auth;
  },
});

export const FIRESTORE = new InjectionToken('Firebase firestore', {
  providedIn: 'root',
  factory: () => {
    let firestore: Firestore;
    if (environment.useEmulators) {
      firestore = initializeFirestore(app, {});
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    } else {
      firestore = getFirestore();
    }
    return firestore;
  },
});

export const FUNCTIONS = new InjectionToken('Firebase functions', {
  providedIn: 'root',
  factory: () => {
    let functions = getFunctions();
    if (environment.useEmulators) {
      connectFunctionsEmulator(functions, 'localhost', 5001)
    }
    return functions;
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};
