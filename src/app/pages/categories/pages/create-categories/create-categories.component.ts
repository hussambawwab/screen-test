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
import { CategoriesService } from '@lib/services/categories/categories.service';

@Component({
  selector: 'app-create-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-categories.component.html',
  styleUrls: ['./create-categories.component.css'],
})
export class CreateCategoriesComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _categoriesService: CategoriesService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      total: [null, Validators.required],
    });
  }
  onSaveClicked() {
    if (this.formGroup.invalid) {
      this.validateAllFormFields(this.formGroup);
      return;
    } else {
      const { name, total } = this.formGroup.value;

      this._categoriesService.createCategories({ name, total }).then(() => {
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
  get total() {
    return this.formGroup.controls['total'];
  }
}
