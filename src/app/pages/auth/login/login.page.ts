import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@lib/services';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage  {
  formGroup!: FormGroup;

  constructor(private _authService: AuthService, private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      emailAddress: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }


  onSignInClicked(): void {
    if (this.formGroup.invalid) {
      this.validateAllFormFields(this.formGroup);
      return;
    } else {
      this._authService.SignIn(this.emailAddress.value, this.password.value);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  get emailAddress() {
    return this.formGroup.controls['emailAddress'];
  }
  get password() {
    return this.formGroup.controls['password'];
  }
}
