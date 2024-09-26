import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Auth, signInWithPhoneNumber, RecaptchaVerifier, signOut } from '@angular/fire/auth'; // Firebase Auth services
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-with-phone',
  templateUrl: './register-with-phone.component.html',
  styleUrls: ['./register-with-phone.component.scss'],
  standalone: true
})
export class RegisterWithPhoneComponent implements OnInit {
  private recaptchaVerifier!: RecaptchaVerifier;
  private confirmationResult: any; // Store confirmationResult after sending the SMS code
  public verificationCode: string = '';

  @ViewChild('phoneNumberInput') phoneNumberInput!: ElementRef;
  @ViewChild('verificationCodeInput') verificationCodeInput!: ElementRef;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.setupRecaptcha();
  }

  // Method to set up the reCAPTCHA verifier
  setupRecaptcha() {
    this.recaptchaVerifier = new RecaptchaVerifier(
      this.auth, 'recaptcha-container',
      {
        size: 'normal',
        callback: () => {
          // reCAPTCHA solved
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      },
    );
  }

  // Method for signing in with phone number
  onSignInSubmit(event: Event) {
    event.preventDefault();
    const phoneNumber = "+48532175660"

    signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
        console.log('SMS sent. Verification code:', confirmationResult);
      })
      .catch((error) => {
        console.error('Error during signInWithPhoneNumber:', error);
      });
  }

  // Method to verify the code entered by the user
  onVerifyCodeSubmit(event: Event) {
    event.preventDefault();
    const code = this.verificationCodeInput.nativeElement.value;

    if (this.confirmationResult) {
      this.confirmationResult.confirm(code)
        .then((result: any) => {
          console.log('User signed in successfully:', result.user);
        })
        .catch((error: any) => {
          console.error('Error while verifying code:', error);
        });
    }
  }

  // Method to cancel the verification process
  cancelVerification(event: Event) {
    event.preventDefault();
    this.confirmationResult = null;
  }

  // Method to sign out the user
  onSignOutClick() {
    signOut(this.auth).then(() => {
      console.log('User signed out.');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }
}
