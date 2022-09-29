import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, EMPTY, filter, Observable } from 'rxjs';
import { BooksService } from '../books/books.service';

@Injectable({
  providedIn: 'root',
})
export class BookResolver implements Resolve<any> {
  constructor(private _booksService: BooksService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._booksService.getBooksById(route.paramMap.get('id')).pipe(
      filter((book) => {
        if (book) {
          return true;
        } else {
          this.router.navigate(['/404']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }),
    );
  }
}
