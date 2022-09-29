import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@lib/components';
import { BooksService } from '@lib/services/books/books.service';
import { CategoriesService } from '@lib/services/categories/categories.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-home',

  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  booksCount = 0;
  categoriesCount = 0;
  constructor(private _categoriesService: CategoriesService, private _booksService: BooksService) {}

  ngOnInit(): void {
    this.getCategories();
    this.getBooks();
  }
  getCategories() {
    this.subscription.add(
      this._categoriesService.getCategories().subscribe({
        next: (data: any[]) => {
          console.log(data);
          this.categoriesCount = data.length;
        },
      }),
    );
  }

  getBooks() {
    this.subscription.add(
      this._booksService.getBooks().subscribe({
        next: (data: any[]) => {
          this.booksCount = data.length;
        },
      }),
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
