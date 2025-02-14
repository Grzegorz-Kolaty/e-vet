// import {
//   computed,
//   inject,
//   Injectable,
//   ResourceStatus,
//   signal,
// } from '@angular/core';
// import { rxResource } from '@angular/core/rxjs-interop';
// import { FirestoreService } from './firestore.service';
// import { Profile } from '../interfaces/user.interface';
// import { User } from '@angular/fire/auth';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   private firestoreService = inject(FirestoreService);
//
//   // sources
//   user = signal<User | null>(null);
//   profile = signal<Profile | null>(null);
//
//   userProfile = rxResource({
//     request: this.user,
//     loader: ({ request: user }) => this.firestoreService.getProfile(user),
//   });
//
//   updateProfile = rxResource({
//     request: this.profile,
//     loader: ({ request: profile }) =>
//       this.firestoreService.updateProfile(profile),
//   });
//
//   // selectors
//   status = computed(() => ResourceStatus[this.userProfile.status()]);
//
//   // profile = computed(() => this.userProfile.value());
//
//   shouldFillProfile = computed(
//     () =>
//       this.userProfile.status() === ResourceStatus.Resolved &&
//       this.userProfile.value() === undefined
//   );
// }
