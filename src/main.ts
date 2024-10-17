// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';
//
// let appRef: any = null;
//
// // Funkcja do tworzenia elementu app-root w DOM
// const createAppRootElement = () => {
//   const existingRoot = document.getElementById('app-root');
//   if (!existingRoot) {
//     const root = document.createElement('app-root');
//     document.body.appendChild(root);
//   }
// };
//
// // Funkcja do usuwania elementu app-root z DOM
// const removeAppRootElement = () => {
//   const existingRoot = document.getElementById('app-root');
//   if (existingRoot) {
//     document.body.removeChild(existingRoot);
//   }
// };
//
// const destroyAppComponent = () => {
//   if (appRef) {
//     appRef.destroy();
//     appRef = null;
//     removeAppRootElement();
//     console.log('AppComponent destroyed');
//   }
// };
//
// const createAppComponent = async () => {
//   if (!appRef) {
//     createAppRootElement();
//     appRef = await bootstrapApplication(AppComponent, appConfig);
//     console.log('AppComponent created');
//   }
// };
//
// // Przyciski do sterowania
// document.body.innerHTML = `
//   <button id="createBtn">Create AppComponent</button>
//   <button id="destroyBtn">Destroy AppComponent</button>
// `;
//
// // Podpięcie zdarzeń do przycisków
// document.getElementById('createBtn')?.addEventListener('click', createAppComponent);
// document.getElementById('destroyBtn')?.addEventListener('click', destroyAppComponent);

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
// .catch((err) => console.error(err));
