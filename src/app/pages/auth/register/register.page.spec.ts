import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { blankUserInfo, validUserInfo } from '@lib/mocks';
import { AuthService } from '@lib/services';

import { RegisterPage } from './register.page';
const testUserData = { id: 1, name: 'TekLoon' };
const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

const authServiceSpy = jasmine.createSpyObj('AuthService', ['signUp']);

describe('Register Component Isolated Test', () => {
  let component: RegisterPage;

  beforeEach(
    waitForAsync(() => {
      component = new RegisterPage(authServiceSpy, new FormBuilder(), routerSpy);
    }),
  );

  function updateForm(
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string,
    confirmPassword: string,
  ) {
    component.formGroup.controls['firstName'].setValue(firstName);
    component.formGroup.controls['lastName'].setValue(lastName);
    component.formGroup.controls['emailAddress'].setValue(emailAddress);
    component.formGroup.controls['password'].setValue(password);
    component.formGroup.controls['confirmPassword'].setValue(confirmPassword);
  }

  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.invalid).toBeTruthy();
  });

  it('submitted should be true when onSignInClicked()', () => {
    component.onClickSignUp();
    expect(component.formGroup.invalid).toBeFalsy();
  });

  it('form value should update from when u change the input', () => {
    updateForm(
      validUserInfo.firstName,
      validUserInfo.lastName,
      validUserInfo.username,
      validUserInfo.password,
      validUserInfo.confirmPassword,
    );
    expect(component.formGroup.value).toEqual(validUserInfo);
  });

  it('Form invalid should be true when form is invalid', () => {
    updateForm(
      blankUserInfo.firstName,
      blankUserInfo.lastName,
      blankUserInfo.username,
      blankUserInfo.password,
      blankUserInfo.confirmPassword,
    );
    expect(component.formGroup.invalid).toBeTruthy();
  });
});

describe('Register Component Shallow Test', () => {
  let fixture: ComponentFixture<RegisterPage>;

  function updateForm(
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string,
    confirmPassword: string,
  ) {
    fixture.componentInstance.formGroup.controls['firstName'].setValue(firstName);
    fixture.componentInstance.formGroup.controls['lastName'].setValue(lastName);
    fixture.componentInstance.formGroup.controls['emailAddress'].setValue(emailAddress);
    fixture.componentInstance.formGroup.controls['password'].setValue(password);
    fixture.componentInstance.formGroup.controls['confirmPassword'].setValue(confirmPassword);
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
        providers: [{ provide: AuthService, useValue: authServiceSpy }, FormBuilder],
        declarations: [RegisterPage],
      }).compileComponents();
      fixture = TestBed.createComponent(RegisterPage);
    }),
  );

  it('created a form with firstName , lastName , email, password,confirm password input and Register button', () => {
    const usernameContainer = fixture.debugElement.nativeElement.querySelector('#username-container');
    const passwordContainer = fixture.debugElement.nativeElement.querySelector('#password-container');
    const loginBtnContainer = fixture.debugElement.nativeElement.querySelector('#login-btn-container');
    const firstNameContainer = fixture.debugElement.nativeElement.querySelector('#firstName-container');
    const lastNameContainer = fixture.debugElement.nativeElement.querySelector('#lastName-container');
    const confirmPasswordContainer = fixture.debugElement.nativeElement.querySelector('#confirmPassword-container');

    expect(usernameContainer).toBeDefined();
    expect(passwordContainer).toBeDefined();
    expect(loginBtnContainer).toBeDefined();
    expect(firstNameContainer).toBeDefined();
    expect(lastNameContainer).toBeDefined();
    expect(confirmPasswordContainer).toBeDefined();

  });
  it('Display First name Error Msg when Email Address is blank', () => {
    updateForm(
      blankUserInfo.firstName,
      validUserInfo.lastName,
      validUserInfo.username,
      validUserInfo.password,
      validUserInfo.confirmPassword,
    );
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('#firstName-error-msg');
    expect(usernameErrorMsg).toBeDefined();
    expect(usernameErrorMsg.innerHTML).toContain('You must enter a value');
  });
  it('Display Last  name Error Msg when Email Address is blank', () => {
    updateForm(
      validUserInfo.firstName,
      blankUserInfo.lastName,
      validUserInfo.username,
      validUserInfo.password,
      validUserInfo.confirmPassword,
    );
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('#lastName-error-msg');
    expect(usernameErrorMsg).toBeDefined();
    expect(usernameErrorMsg.innerHTML).toContain('You must enter a value');
  });
  it('Display Email Address Error Msg when Email Address is blank', () => {
    updateForm(
      validUserInfo.firstName,
      validUserInfo.lastName,
      blankUserInfo.username,
      validUserInfo.password,
      validUserInfo.confirmPassword,
    );
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('#username-error-msg');
    expect(usernameErrorMsg).toBeDefined();
    expect(usernameErrorMsg.innerHTML).toContain('You must enter a value');
  });

  it('Display Password Error Msg when password is blank', () => {
    updateForm(
      validUserInfo.firstName,
      validUserInfo.lastName,
      validUserInfo.username,
      blankUserInfo.password,
      validUserInfo.confirmPassword,
    );
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector('#password-error-msg');
    expect(passwordErrorMsg).toBeDefined();
    expect(passwordErrorMsg.innerHTML).toContain('You must enter a value');
  });

  it('Display Both Email Address & Password Error Msg when both field is blank', () => {
    updateForm(
      blankUserInfo.firstName,
      blankUserInfo.lastName,
      blankUserInfo.username,
      blankUserInfo.password,
      blankUserInfo.confirmPassword,
    );
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('#username-error-msg');
    const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector('#password-error-msg');
    const firstNameErrorMsg = fixture.debugElement.nativeElement.querySelector('#firstName-error-msg');
    const lastNameErrorMsg = fixture.debugElement.nativeElement.querySelector('#lastName-error-msg');
    const confirmPasswordErrorMsg = fixture.debugElement.nativeElement.querySelector('#confirmPassword-error-msg');

    expect(usernameErrorMsg).toBeDefined();
    expect(usernameErrorMsg.innerHTML).toContain('You must enter a value');

    expect(passwordErrorMsg).toBeDefined();
    expect(passwordErrorMsg.innerHTML).toContain('You must enter a value');

    expect(firstNameErrorMsg).toBeDefined();
    expect(firstNameErrorMsg.innerHTML).toContain('You must enter a value');

    expect(lastNameErrorMsg).toBeDefined();
    expect(lastNameErrorMsg.innerHTML).toContain('You must enter a value');

    expect(confirmPasswordErrorMsg).toBeDefined();
    expect(confirmPasswordErrorMsg.innerHTML).toContain('You must enter a value');
  });

  describe('Register Component Integrated Test', () => {
    let fixture: ComponentFixture<RegisterPage>;
    let loginSpy;
    function updateForm(
      firstName: string,
      lastName: string,
      emailAddress: string,
      password: string,
      confirmPassword: string,
    ) {
      fixture.componentInstance.formGroup.controls['firstName'].setValue(firstName);
      fixture.componentInstance.formGroup.controls['lastName'].setValue(lastName);
      fixture.componentInstance.formGroup.controls['emailAddress'].setValue(emailAddress);
      fixture.componentInstance.formGroup.controls['password'].setValue(password);
      fixture.componentInstance.formGroup.controls['confirmPassword'].setValue(confirmPassword);
    }
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
        providers: [{ provide: AuthService, useValue: authServiceSpy }, FormBuilder],
        declarations: [RegisterPage],
      }).compileComponents();

      fixture = TestBed.createComponent(RegisterPage);

      loginSpy = authServiceSpy.SignIn.and.returnValue(Promise.resolve(testUserData));
    }));

    it('loginService signUp() should called ', fakeAsync(() => {
      updateForm(
        validUserInfo.firstName,
        validUserInfo.lastName,
        validUserInfo.username,
        validUserInfo.password,
        validUserInfo.confirmPassword,
      );
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();

      expect(authServiceSpy.signUp).toHaveBeenCalled();
    }));

    it('should route to home if signUp successfully', fakeAsync(() => {
      updateForm(
        validUserInfo.firstName,
        validUserInfo.lastName,
        validUserInfo.username,
        validUserInfo.password,
        validUserInfo.confirmPassword,
      );
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      advance(fixture);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      loginSpy = authServiceSpy.signUp.and.returnValue(Promise.resolve(testUserData));
      advance(fixture);

      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
      expect(navArgs).toBe('/home', 'should nav to Home Page');
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function advance(f: ComponentFixture<any>) {
      tick();
      f.detectChanges();
    }
  });
});
