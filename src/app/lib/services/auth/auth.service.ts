import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '@lib/interfaces';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  isLoggedInSubject$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('user')!));

  get isLoggedInSubject(): boolean {
    return this.isLoggedInSubject$.getValue();
  }



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.isLoggedInSubject$.next(true)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.parse(localStorage.getItem('user')!);

      } else {
        localStorage.removeItem('user');
        this.isLoggedInSubject$.next(false)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      }
    });
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {

        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Sign up with email/password

  signUp(email: string, password: string): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword( email, password));
  }
  // Send email verfificaiton when new user sign up
  // SendVerificationMail() {
  //   return this.afAuth.currentUser
  //     .then((u: any) => u.sendEmailVerification())
  //     .then(() => {
  //       this.router.navigate(['verify-email-address']);
  //     });
  // }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

  SetUserData(user: any) {
    console.log(user)
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.emailAddress,
      firstName: user.firstName,
      lastName:user.lastName,

    };
    return userRef.set(userData, {
      merge: true,
    });

  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.isLoggedInSubject$.next(false);

      this.router.navigate(['/auth/login']);
    });
  }

}


