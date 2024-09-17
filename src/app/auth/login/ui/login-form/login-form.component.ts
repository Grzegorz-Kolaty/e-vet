import {Component, inject, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Credentials} from "../../../../core/interfaces/user.interface";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="login.emit(loginForm.getRawValue())">
      <h1>Email</h1>
      <input
        formControlName="email"
        type="email"
        placeholder="email"
      />

      <h1>Password</h1>
      <input
        formControlName="password"
        type="password"
        placeholder="password"
      />
      <button type="submit">Login</button>
    </form>`,
})
export class LoginFormComponent {
  login = output<Credentials>()

  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: ['grzegorzkolaty@gmail.com', Validators.required],
    password: ['Poszkole1', Validators.required],
  })
}
