import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableType, TableComponent } from '@lib/components';
import { Category } from '@lib/interfaces';
import { CategoriesService } from '@lib/services/categories/categories.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.css'],
})
export class CategoriesPage implements OnInit, OnDestroy {
  dataSource: any[] = [];
  tableConfig: DataTableType = {
    columns: [
      { title: 'Name', dataProperty: 'name' },
      { title: '# of books available', dataProperty: 'total' },
      { title: 'Actions', dataProperty: 'ROW_ACTIONS' },
    ],
    rowActions: [
      { label: 'Edit', actionIdToReturn: 'edit', icon: '...' },
      { label: 'Delete', actionIdToReturn: 'delete', icon: '...' },
    ],
  };
  isLoading = true;
  subscription: Subscription=new Subscription();

  constructor(private router: Router, private _categoriesService: CategoriesService) {}


  ngOnInit(): void {
    this.getCategories();
  }
  getCategories() {
    this.subscription.add(
      this._categoriesService.getCategories().subscribe({
        next: (data: any[]) => {
          this.dataSource = [...data];
          this.isLoading = false;
        },
      }),
    );
  }
  onRowActionClicked($event: any) {
    if ($event.actionToPerform === 'edit') {
      this.editCategoryClicked($event.rowData);
    }
    if ($event.actionToPerform === 'delete') {
      this.deleteCategoryClicked($event.rowData);
    }
  }
  editCategoryClicked(rowData: Category) {
    this.router.navigate(['/categories/edit-categories'], {
      queryParams: {
        id: rowData.id,
      },
    });
  }
  deleteCategoryClicked(rowData: Category) {
    if (rowData.id)
      this._categoriesService.deleteCategories(rowData.id);
  }
  onAddCategoriesClicked() {
    this.router.navigate(['/categories/create-categories']);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
