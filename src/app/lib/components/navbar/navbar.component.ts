import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@lib/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  constructor(private _router: Router, private _authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this._authService.isLoggedInSubject$;
  }
  onClickSignOut(): void {
    this._authService.SignOut();
    this._router.navigateByUrl('/home');
  }

}
