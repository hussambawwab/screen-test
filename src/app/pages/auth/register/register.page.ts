import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '@lib/helper/custom-validators';
import { AuthService } from '@lib/services';
import { switchMap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
})
export class RegisterPage implements OnInit {
  formGroup!: FormGroup;
  constructor(private _authService: AuthService, private formBuilder: FormBuilder, public router: Router) {}
  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],

        emailAddress: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$',
            ),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      CustomValidators.mustMatch('password', 'confirmPassword'),
    );
  }
  onClickSignUp(): void {
    if (this.formGroup.invalid) {
      this.validateAllFormFields(this.formGroup);
      return;
    } else {
      const { emailAddress, password, firstName, lastName } = this.formGroup.value;

      this._authService
        .signUp(emailAddress, password)
        .pipe(
          switchMap(({ user: { uid } }) =>
            this._authService.SetUserData({ uid, emailAddress, firstName: firstName, lastName: lastName }),
          ),
        )
        .subscribe(() => {
          this.router.navigate(['/home']);
        });
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
  get firstName() {
    return this.formGroup.controls['firstName'];
  }
  get lastName() {
    return this.formGroup.controls['lastName'];
  }
  get emailAddress() {
    return this.formGroup.controls['emailAddress'];
  }
  get password() {
    return this.formGroup.controls['password'];
  }
  get confirmPassword() {
    return this.formGroup.controls['confirmPassword'];
  }
}
