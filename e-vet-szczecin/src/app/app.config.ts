import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
// import {initializeApp} from 'firebase/app';
// import {
//   Firestore,
//   initializeFirestore,
//   connectFirestoreEmulator,
//   getFirestore,
// } from 'firebase/firestore';
// import {getAuth, connectAuthEmulator} from 'firebase/auth';
// import {getStorage, connectStorageEmulator, FirebaseStorage} from 'firebase/storage';
// import {connectFunctionsEmulator, getFunctions, Functions} from 'firebase/functions';
// import {initializeAppCheck, ReCaptchaV3Provider} from 'firebase/app-check';
import {routes} from './app.routes';
import {provideFirebaseServices} from "./firebase.providers";

// export const app = initializeApp(environment.firebase);

// declare global {
//   interface Window {
//     FIREBASE_APPCHECK_DEBUG_TOKEN: string;
//   }
// }

// export function provideAppCheck(): EnvironmentProviders {
//   window.FIREBASE_APPCHECK_DEBUG_TOKEN = environment.firebase.recaptchaToken;
//
//   const appCheck = initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider(environment.firebase.recaptchaToken),
//     isTokenAutoRefreshEnabled: true
//   });
//
//   return makeEnvironmentProviders([
//     {provide: appCheck, useValue: appCheck}
//   ]);
// }
//
// export const AUTH = new InjectionToken('Firebase auth', {
//   providedIn: 'root',
//   factory: () => {
//     const auth = getAuth();
//     if (!environment.production) {
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
//     if (!environment.production) {
//       firestore = initializeFirestore(app, {});
//       connectFirestoreEmulator(firestore, 'localhost', 8080);
//     } else {
//       firestore = getFirestore(app);
//     }
//     return firestore;
//   },
// });
//
// export const STORAGE = new InjectionToken('Firebase storage', {
//   providedIn: 'root',
//   factory: () => {
//     let storage: FirebaseStorage;
//     if (!environment.production) {
//       storage = getStorage(app);
//       connectStorageEmulator(storage, 'localhost', 9199);
//     } else {
//       storage = getStorage();
//     }
//     return storage;
//   },
// });
//
// export const FUNCTIONS = new InjectionToken('Firebase functions', {
//   providedIn: 'root',
//   factory: () => {
//     let functions: Functions;
//     if (!environment.production) {
//       functions = getFunctions();
//       connectFunctionsEmulator(functions, 'localhost', 5001);
//     } else {
//       functions = getFunctions(app);
//     }
//     return functions;
//   },
// });

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseServices()
  ]
};
