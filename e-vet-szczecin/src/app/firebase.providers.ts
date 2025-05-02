import {EnvironmentProviders, InjectionToken, makeEnvironmentProviders} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {Firestore, initializeFirestore, connectFirestoreEmulator, getFirestore} from 'firebase/firestore';
import {getAuth, connectAuthEmulator, Auth} from 'firebase/auth';
import {getStorage, connectStorageEmulator, FirebaseStorage} from 'firebase/storage';
import {connectFunctionsEmulator, getFunctions, Functions} from 'firebase/functions';
import {AppCheck, initializeAppCheck, ReCaptchaV3Provider} from 'firebase/app-check';
import {environment} from '../environments/environment';


declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: string;
  }
}

const firebaseApp = initializeApp(environment.firebase);
export const AUTH = new InjectionToken<Auth>('Firebase Auth');
export const FIRESTORE = new InjectionToken<Firestore>('Firebase Firestore');
export const STORAGE = new InjectionToken<FirebaseStorage>('Firebase Storage');
export const FUNCTIONS = new InjectionToken<Functions>('Firebase Functions');
export const APP_CHECK = new InjectionToken<AppCheck>('Firebase AppCheck');

export function provideFirebaseServices(): EnvironmentProviders {
  if (!environment.production) {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = environment.firebase.recaptchaToken
  }

  const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(environment.firebase.recaptchaToken),
    isTokenAutoRefreshEnabled: true
  });

  const auth = getAuth(firebaseApp);
  if (!environment.production) {
    connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
  }

  let firestore: Firestore;
  if (!environment.production) {
    firestore = initializeFirestore(firebaseApp, {});
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  } else {
    firestore = getFirestore(firebaseApp);
  }

  let storage: FirebaseStorage;
  if (!environment.production) {
    storage = getStorage(firebaseApp);
    connectStorageEmulator(storage, 'localhost', 9199);
  } else {
    storage = getStorage(firebaseApp);
  }

  let functions: Functions;
  if (!environment.production) {
    functions = getFunctions(firebaseApp);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } else {
    functions = getFunctions(firebaseApp);
  }

  return makeEnvironmentProviders([
    {provide: AUTH, useValue: auth},
    {provide: FIRESTORE, useValue: firestore},
    {provide: STORAGE, useValue: storage},
    {provide: FUNCTIONS, useValue: functions},
    {provide: APP_CHECK, useValue: appCheck}
  ])
}
