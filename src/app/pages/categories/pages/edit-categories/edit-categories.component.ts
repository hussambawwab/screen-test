import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoriesService } from '@lib/services/categories/categories.service';

@Component({
  selector: 'app-edit-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.css'],
})
export class EditCategoriesComponent implements OnInit {
  formGroup!: FormGroup;
  categoryId!: string;
  constructor(
    private formBuilder: FormBuilder,
    private _categoriesService: CategoriesService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      total: [null, Validators.required],
    });
    this.initRoute();
    this.getCatigorybyId();
  }
  initRoute() {
    this.activatedRoute.queryParams.subscribe((result) => {
      if (result['id']) {
        this.categoryId = result['id'];
      }
    });
  }
  getCatigorybyId() {
    this._categoriesService.getCategoryById(this.categoryId).subscribe((data) => {
      console.log(data);
      this.name.setValue(data?.name);
      this.total.setValue(data?.total);
    });
  }
  onSaveClicked() {
    if (this.formGroup.invalid) {
      this.validateAllFormFields(this.formGroup);
      return;
    } else {
      const { name, total } = this.formGroup.value;

      this._categoriesService.updateCategories(this.categoryId,{ name, total }).then(() => {
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
