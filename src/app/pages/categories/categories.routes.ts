import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'Categories',
    loadComponent: async () => (await import('./categories.page')).CategoriesPage,
  },
  {
    path: 'create-categories',
    title: 'Create Categories',
    loadComponent: async () => (await import('./pages/create-categories/create-categories.component')).CreateCategoriesComponent,
  },
  {
    path: 'edit-categories',
    title: 'Edit Categories',
    loadComponent: async () => (await import('./pages/edit-categories/edit-categories.component')).EditCategoriesComponent,
  },
];
