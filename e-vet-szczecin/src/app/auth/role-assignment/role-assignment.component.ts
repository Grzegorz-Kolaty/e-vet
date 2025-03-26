// import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
// import {AuthService} from '../../shared/data-access/auth.service';
// import {Role} from '../../shared/interfaces/user.interface';
// import {FunctionsService} from '../../shared/data-access/functions.service';
// import {rxResource} from '@angular/core/rxjs-interop';
//
// @Component({
//   selector: 'app-role-assignment',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: `
//     <div class="container-fluid text-center col-xl-4 p-lg-5 p-4">
//       <h4 class="text-center px-2">Wybierz rolę</h4>
//       <button
//         type="button"
//         class="btn btn-lg btn-outline-secondary m-2"
//         (click)="onUpdateRoleSig.set(Role.User)"
//         [disabled]="onUpdateRole.isLoading() || this.authService.isLoadingToken()">
//         Użytkownik
//       </button>
//
//       <button
//         type="button"
//         class="btn btn-lg btn-outline-secondary m-2"
//         (click)="onUpdateRoleSig.set(Role.Vet)"
//         [disabled]="onUpdateRole.isLoading() || this.authService.isLoadingToken()">
//         Weterynarz
//       </button>
//     </div>
//   `,
//   styles: ``,
// })
// export class RoleAssignmentComponent {
//   authService = inject(AuthService);
//   functionsService = inject(FunctionsService);
//   protected readonly Role = Role;
//
//   onUpdateRoleSig = signal<Role | undefined>(undefined)
//   onUpdateRole = rxResource({
//     request: () => this.onUpdateRoleSig(),
//     loader: v => this.functionsService.setCustomClaimsRole(v.request)
//   })
//
//   constructor() {
//     effect(() => {
//       if (this.onUpdateRole.status() === 4) {
//         this.authService.refreshToken()
//       }
//     });
//   }
//
// }
