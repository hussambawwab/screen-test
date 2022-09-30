/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { blankUser, validUser } from '@lib/mocks';
import { AuthService } from '@lib/services';

import { LoginPage } from './login.page';
const testUserData = { id: 1, name: 'TekLoon' };
const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

const authServiceSpy = jasmine.createSpyObj('AuthService', ['SignIn']);

describe('Login Component Isolated Test', () => {
  let component: LoginPage;

  beforeEach(
    waitForAsync(() => {
      component = new LoginPage(authServiceSpy, new FormBuilder());
    }),
  );

  function updateForm(emailAddress: string, password: string) {
    component.formGroup.controls['emailAddress'].setValue(emailAddress);
    component.formGroup.controls['password'].setValue(password);
  }

  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.invalid).toBeTruthy();
  });

  it('submitted should be true when onSignInClicked()', () => {
    component.onSignInClicked();
    expect(component.formGroup.invalid).toBeFalsy();
  });

  it('form value should update from when u change the input', () => {
    updateForm(validUser.username, validUser.password);
    expect(component.formGroup.value).toEqual(validUser);
  });

  it('Form invalid should be true when form is invalid', () => {
    updateForm(blankUser.username, blankUser.password);
    expect(component.formGroup.invalid).toBeTruthy();
  });
});

describe('Login Component Shallow Test', () => {
  let fixture: ComponentFixture<LoginPage>;

  function updateForm(emailAddress: string, userPassword: string) {
    fixture.componentInstance.formGroup.controls['emailAddress'].setValue(emailAddress);
    fixture.componentInstance.formGroup.controls['password'].setValue(userPassword);
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
        providers: [{ provide: AuthService, useValue: authServiceSpy }, FormBuilder],
        declarations: [LoginPage],
      }).compileComponents();
      fixture = TestBed.createComponent(LoginPage);
    }),
  );

  it('created a form with username and password input and login button', () => {
    // const fixture = TestBed.createComponent(LoginComponent);
    const usernameContainer = fixture.debugElement.nativeElement.querySelector('#username-container');
    const passwordContainer = fixture.debugElement.nativeElement.querySelector('#password-container');
    const loginBtnContainer = fixture.debugElement.nativeElement.querySelector('#login-btn-container');
    expect(usernameContainer).toBeDefined();
    expect(passwordContainer).toBeDefined();
    expect(loginBtnContainer).toBeDefined();
  });

  it('Display Email Address Error Msg when Email Address is blank', () => {
    updateForm(blankUser.username, validUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('#username-error-msg');
    expect(usernameErrorMsg).toBeDefined();
    expect(usernameErrorMsg.innerHTML).toContain('You must enter a value');
  });

  it('Display Password Error Msg when password is blank', () => {
    updateForm(validUser.username, blankUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector('#password-error-msg');
    expect(passwordErrorMsg).toBeDefined();
    expect(passwordErrorMsg.innerHTML).toContain('You must enter a value');
  });

  it('Display Both Email Address & Password Error Msg when both field is blank', () => {
    updateForm(blankUser.username, blankUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('#username-error-msg');
    const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector('#password-error-msg');

    expect(usernameErrorMsg).toBeDefined();
    expect(usernameErrorMsg.innerHTML).toContain('You must enter a value');

    expect(passwordErrorMsg).toBeDefined();
    expect(passwordErrorMsg.innerHTML).toContain('You must enter a value');
  });

  describe('Login Component Integrated Test', () => {
    let fixture: ComponentFixture<LoginPage>;
    let loginSpy;
    function updateForm(userEmailAddress: string, userPassword: string) {
      fixture.componentInstance.formGroup.controls['emailAddress'].setValue(userEmailAddress);
      fixture.componentInstance.formGroup.controls['password'].setValue(userPassword);
    }

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
        providers: [{ provide: AuthService, useValue: authServiceSpy }, FormBuilder],
        declarations: [LoginPage],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginPage);
      // router = TestBed.get(Router);

      loginSpy = authServiceSpy.SignIn.and.returnValue(Promise.resolve(testUserData));
    }));

    it('loginService login() should called ', fakeAsync(() => {
      updateForm(validUser.username, validUser.password);
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();

      expect(authServiceSpy.SignIn).toHaveBeenCalled();
    }));

    it('should route to home if login successfully', fakeAsync(() => {
      updateForm(validUser.username, validUser.password);
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      advance(fixture);

      loginSpy = authServiceSpy.SignUp.and.returnValue(Promise.resolve(testUserData));
      advance(fixture);

      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
      // expecting to navigate to id of the component's first hero
      expect(navArgs).toBe('/home', 'should nav to Home Page');
    }));
    function advance(f: ComponentFixture<any>) {
      tick();
      f.detectChanges();
    }
  });
});
