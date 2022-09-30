import { Injectable } from '@angular/core';
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
  userData: any;
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.isLoggedInSubject$.next(true);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.removeItem('user');
        this.isLoggedInSubject$.next(false);
      }
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signUp(email: string, password: string): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }

  get isLoggedIn(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.isLoggedInSubject$.next(false);

      this.router.navigate(['/auth/login']);
    });
  }
}
