import {EnvironmentProviders, InjectionToken, makeEnvironmentProviders} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {Firestore, initializeFirestore, connectFirestoreEmulator} from 'firebase/firestore';
import {getAuth, connectAuthEmulator, Auth} from 'firebase/auth';
import {getStorage, connectStorageEmulator, FirebaseStorage} from 'firebase/storage';
import {connectFunctionsEmulator, getFunctions, Functions} from 'firebase/functions';
import {AppCheck, initializeAppCheck, ReCaptchaV3Provider} from 'firebase/app-check';
import {environment} from '../environments/environment';


declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN: string | false;
  }
}

const firebaseApp = initializeApp(environment.firebase);

export const AUTH = new InjectionToken<Auth>('Firebase Auth');
export const FIRESTORE = new InjectionToken<Firestore>('Firebase Firestore');
export const STORAGE = new InjectionToken<FirebaseStorage>('Firebase Storage');
export const APPCHECK = new InjectionToken<AppCheck>('Firebase AppCheck');
export const FUNCTIONS = new InjectionToken<Functions>('Firebase Functions');

export function provideFirebaseServices(): EnvironmentProviders {
  const auth = getAuth(firebaseApp);
  const firestore = initializeFirestore(firebaseApp, {})
  const storage = getStorage(firebaseApp);
  const functions = getFunctions(firebaseApp);
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = false

  if (!environment.production) {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = environment.firebase.recaptchaToken // for emulating appcheck
    connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }


  const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(environment.firebase.recaptchaToken),
    isTokenAutoRefreshEnabled: true
  });

  return makeEnvironmentProviders([
    {provide: AUTH, useValue: auth},
    {provide: FIRESTORE, useValue: firestore},
    {provide: STORAGE, useValue: storage},
    {provide: APPCHECK, useValue: appCheck},
    {provide: FUNCTIONS, useValue: functions},
  ])
}
