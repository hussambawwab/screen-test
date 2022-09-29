import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CategoriesPage } from './categories.page';

describe('ProfilePage', () => {
  let component: CategoriesPage;
  let fixture: ComponentFixture<CategoriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesPage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
