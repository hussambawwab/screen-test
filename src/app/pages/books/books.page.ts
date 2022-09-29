import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataTableType, TableComponent } from '@lib/components';
import { BooksService } from '@lib/services/books/books.service';
import { CategoriesService } from '@lib/services/categories/categories.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, TableComponent, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './books.page.html',
  styleUrls: ['./books.page..css'],
})
export class BooksPage implements OnInit, OnDestroy {
  dataSource: any = {
    data: [],
    filteredData: [],
  };
  tableConfig: DataTableType = {
    columns: [{ title: 'Book', dataProperty: 'name' }],
    rowActions: [
      { label: 'Edit', actionIdToReturn: 'edit', icon: '...' },
      { label: 'Delete', actionIdToReturn: 'delete', icon: '...' },
    ],
  };
  isLoading = true;
  subscription: Subscription = new Subscription();
  categoriesList: any[] = [];
  selectedCategory: any;

  constructor(
    private _booksService: BooksService,
    private _catiegoriesService: CategoriesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getBooks();
  }

  getBooks() {
    this.subscription.add(
      this._booksService.getBooks().subscribe({
        next: (data: any[]) => {
          this.dataSource = {
            data: [...data],
            filteredData: [...data],
          };
          this.isLoading = false;
        },
      }),
    );
  }
  getCategories() {
    this.subscription.add(
      this._catiegoriesService.getCategories().subscribe({
        next: (data: any[]) => {
          this.categoriesList = [...data];
          this.isLoading = false;
        },
      }),
    );
  }
  onRowActionClicked($event: any) {
    console.log();
  }
  onSelectionChange() {
    if (this.selectedCategory !=='null') {
      this.dataSource.filteredData = this.dataSource.data.filter(
        (obj: any) => obj.categoryId === this.selectedCategory,
      );
    } else {
      this.dataSource.filteredData = this.dataSource.data;
    }
  }
  onRowClicked($event: any) {
      this.router.navigate(['/books/book-preview/'+$event.id]);


  }
  onAddCategoriesClicked() {
    this.router.navigate(['/books/create-book']);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
