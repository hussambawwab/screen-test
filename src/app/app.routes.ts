import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from '@lib/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: async () => (await import('@pages/auth/auth.routes')).ROUTES,
    canLoad: [NoAuthGuard],
  },
  {
    path: 'home',
    loadChildren: async () => (await import('@pages/home/home.routes')).ROUTES,
  },
  {
    path: 'categories',
    loadChildren: async () => (await import('@pages/categories/categories.routes')).ROUTES,
    canLoad: [AuthGuard],
  },
  {
    path: 'books',
    loadChildren: async () => (await import('@pages/books/books.routes')).ROUTES,
    canLoad: [AuthGuard],
  },
  {
    path: '**',
    loadComponent: async () => (await import('@pages/screens/not-found/not-found.page')).NotFoundPage,
  },
];
