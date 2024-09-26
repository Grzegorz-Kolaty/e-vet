import {Component, inject, output} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Credentials} from "../../../../core/interfaces/user.interface";
import {passwordMatchesValidator} from "../../utils/password-matches";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <h1>Register</h1>
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <!--  <input type="text" placeholder="username" formControlName="username"/>-->
      <input type="text" placeholder="email" formControlName="email"/>
      <input type="password" placeholder="password" formControlName="password"/>
      <input type="password" placeholder="password" formControlName="confirmPassword"/>
      <!--      <input type="text" placeholder="telephone" formControlName="phone">-->

      <button type="submit">Sign In</button>
    </form>
  `,
})
export class RegisterFormComponent {
  fb = inject(FormBuilder);
  register = output<Credentials>();
  registerClinic = output<Credentials>();

  registerForm = this.fb.nonNullable.group(
    {
      email: ['grzegorzkolaty@gmail.com', Validators.required],
      password: ['Poszkole1', Validators.required],
      confirmPassword: ['Poszkole1', Validators.required],
    }, {
      validators: [passwordMatchesValidator]
    })

  onSubmit() {
    if (this.registerForm.valid) {
      const {confirmPassword, ...credentials} =
        this.registerForm.getRawValue();
      this.register.emit(credentials);
    }
  }
}
