import {ApplicationConfig, InjectionToken, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {initializeApp} from 'firebase/app';

import {routes} from './app.routes';
import {environment} from '../environments/environment';

const app = initializeApp(environment.firebase);

import {
  Firestore,
  initializeFirestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore';
import {getAuth, connectAuthEmulator} from 'firebase/auth';
import {
  getStorage,
  connectStorageEmulator,
  FirebaseStorage,
} from 'firebase/storage';
import {
  connectFunctionsEmulator,
  getFunctions,
  Functions,
} from 'firebase/functions';

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
      firestore = getFirestore(app);
    }
    return firestore;
  },
});

export const STORAGE = new InjectionToken('Firebase storage', {
  providedIn: 'root',
  factory: () => {
    let storage: FirebaseStorage;
    if (environment.useEmulators) {
      storage = getStorage(app);
      connectStorageEmulator(storage, 'localhost', 9199);
    } else {
      storage = getStorage();
    }
    return storage;
  },
});

export const FUNCTIONS = new InjectionToken('Firebase functions', {
  providedIn: 'root',
  factory: () => {
    let functions: Functions;
    if (environment.useEmulators) {
      functions = getFunctions(app);
      connectFunctionsEmulator(functions, 'localhost', 5001);
    } else {
      functions = getFunctions(app);
    }
    return functions;
  },
});

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes)]
};
