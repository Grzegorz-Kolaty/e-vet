import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const passwordMatchesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password && confirmPassword && password === confirmPassword
    ? null
    : {passwordMatch: true};
};


// export const emailValidator: ValidatorFn = (
//   control: AbstractControl
// ): ValidationErrors | null => {
//   const email = control.value
//
//   const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
//
//   console.log(email)
//   console.log(emailRegex.test(email))
//   return emailRegex.test(email) ? null : {invalidEmail: true};
// }
