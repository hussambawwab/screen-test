import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BooksService } from '@lib/services/books/books.service';
import { CategoriesService } from '@lib/services/categories/categories.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-create-book',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],

  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css'],
})
export class CreateBookComponent implements OnInit {
  formGroup!: FormGroup;
  subscription: Subscription = new Subscription();
  categoriesList: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private _booksService: BooksService,
    private location: Location,
    private _catiegoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      categoryId: [null, Validators.required],
    });
    this.getCategories();

  }
  getCategories() {
    this.subscription.add(
      this._catiegoriesService.getCategories().subscribe({
        next: (data: any[]) => {
          this.categoriesList = [...data];
        },
      }),
    );
  }
  onSaveClicked() {
    if (this.formGroup.invalid) {
      this.validateAllFormFields(this.formGroup);
      return;
    } else {
      const { name, categoryId } = this.formGroup.value;

      this._booksService.createBooks({ name, categoryId }).then(() => {
        this.location.back();
      });
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  get name() {
    return this.formGroup.controls['name'];
  }
  get categoryId() {
    return this.formGroup.controls['categoryId'];
  }
}
