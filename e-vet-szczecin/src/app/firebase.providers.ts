import {EnvironmentProviders, InjectionToken, makeEnvironmentProviders} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {Firestore, initializeFirestore, connectFirestoreEmulator} from 'firebase/firestore';
import {getAuth, connectAuthEmulator, Auth} from 'firebase/auth';
import {getStorage, connectStorageEmulator, FirebaseStorage} from 'firebase/storage';
import {connectFunctionsEmulator, getFunctions, Functions} from 'firebase/functions';
import {initializeAppCheck, ReCaptchaV3Provider} from 'firebase/app-check';
import {environment} from '../environments/environment';


declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN: string;
  }
}

const firebaseApp = initializeApp(environment.firebase);
export const AUTH = new InjectionToken<Auth>('Firebase Auth');
export const FIRESTORE = new InjectionToken<Firestore>('Firebase Firestore');
export const STORAGE = new InjectionToken<FirebaseStorage>('Firebase Storage');
export const FUNCTIONS = new InjectionToken<Functions>('Firebase Functions');

export function provideFirebaseServices(): EnvironmentProviders {
  const auth = getAuth(firebaseApp);
  const functions = getFunctions(firebaseApp);
  const firestore = initializeFirestore(firebaseApp, {})
  const storage = getStorage(firebaseApp);
  if (!environment.production) {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = environment.firebase.recaptchaToken // for emulating appcheck
    connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  }

  const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(environment.firebase.recaptchaToken),
    isTokenAutoRefreshEnabled: true
  });

  return makeEnvironmentProviders([
    {provide: AUTH, useValue: auth},
    {provide: FIRESTORE, useValue: firestore},
    {provide: STORAGE, useValue: storage},
    {provide: FUNCTIONS, useValue: functions}
  ])
}
