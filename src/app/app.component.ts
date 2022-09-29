import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '@lib/components';
import { AuthService } from '@lib/services';
import { Observable } from 'rxjs';
import { LayoutHorizontalComponent } from './lib/components/layouts/layout-horizontal/layout-horizontal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LayoutHorizontalComponent,
    NavbarComponent,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  currentRoute: string;
  hideNavBar=true;
  constructor(private _authService: AuthService, private router: Router) {
    this.currentRoute = '';
    this.subscribeRout();
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this._authService.isLoggedInSubject$;
  }
  subscribeRout() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event['url'];
        this.hideNavBar = this.currentRoute.includes('auth');
      }
    });
  }
}
