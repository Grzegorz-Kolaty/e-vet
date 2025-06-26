import {ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, resource, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../shared/data-access/auth.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Router} from '@angular/router';
import {Role} from '../../shared/interfaces/user.interface';
import {FunctionsService} from '../../shared/data-access/functions.service';
import {FirestoreService} from "../../shared/data-access/firestore.service";
import {ProfilePicComponent} from "../../dashboard/ui/profile-pic/profile-pic.component";


@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="btn btn-outline-primary" type="button" (click)="firestoreService.data()">
      Zapisz
    </button>

    <input type="text"
           #inputsig/>
    <section>
      <!--        <app-profile-pic [firebaseUser]="authService.firebaseUser()"/>-->

      <!--        <div class="mt-5 p-3 text-center">-->
      <!--              <h4>{{ userRole() === Role.Vet ? Role.Vet + '.' : '' }}{{ firebaseUser()?.displayName }}</h4>-->
      <!--              <div class="d-inline-flex">-->
      <!--                <button class="btn btn-lg btn-outline-primary mx-3" type="submit">Kliniki</button>-->
      <!--                <button class="btn btn-lg btn-primary mx-2" type="submit">Pacjenci</button>-->
      <!--              </div>-->
      <!--        </div>-->

      <!--        <app-profile-form-->
      <!--          [firebaseUser]="authService.firebaseUser()"-->
      <!--          [role]="Role.User"-->
      <!--          (userName)="displayNameSig.set($event)"-->
      <!--          [status]="displayNameChangeStatus()"-->
      <!--        />-->


    </section>
  `,
  styles: ``,
  // providers: [FirestoreService]
})
export default class ProfileComponent implements OnDestroy {
  authService = inject(AuthService);
  functionsService = inject(FunctionsService)
  firestoreService = inject(FirestoreService)
  router = inject(Router);

  protected readonly Role = Role;

  displayNameSig = signal<string | undefined>(undefined);
  onDisplayNameChange = resource({
    request: () => this.displayNameSig(),
    loader: name => this.authService.updateProfiles(name.request!)
  })
  displayNameChangeStatus = computed(() => this.onDisplayNameChange.status())

  constructor() {
    // effect(() => {
    //   console.log(this.firestoreService.steamData.value())
    // })

    // this.firestoreService.data()

    effect(() => {
      console.log(this.firestoreService.dataSig())
    });
    // effect(() => {
    //   console.log(this.firestoreService.userDoc().subscribe())
    // })


    // effect(() => {
    //   console.log(this.firestoreService.lazyListening())
    // })
    //
    // effect(() => {
    //   console.log(this.firestoreService.userDoc())
    // })

    // effect(() => {
    //   if (!this.authService.firebaseUser()) {
    //     this.router.navigate(['auth', 'login']);
    //   }
    // });

    // effect(() => {
    //   console.log(this.displayNameChangeStatus());
    // });
  }


  // updateAuthDisplayName(name: string, firebaseUser: User) {
  //   this.isLoading.set(true);
  //   this.authService.updateProfileData({displayName: name}, firebaseUser).subscribe({
  //     next: () => {
  //       console.log(name);
  //     },
  //     error: err => console.error(err),
  //     complete: () => {
  //       this.isLoading.set(false);
  //       console.log('authProfile name updated');
  //     },
  //   });
  // }

  ngOnDestroy() {
    console.log('profile component destroyed')
    this.firestoreService.data()

  }


}
