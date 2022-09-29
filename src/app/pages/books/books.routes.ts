import { Route } from '@angular/router';
import { BookResolver } from '@lib/services/resolvers/book.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'Books',
    loadComponent: async () => (await import('./books.page')).BooksPage,
  },
  {
    path: 'create-book',
    title: 'Create Book',
    loadComponent: async () =>
      (await import('./pages/create-book/create-book.component')).CreateBookComponent,
  },
  {
    path: 'book-preview/:id',
    title: 'Preview',
    resolve: { data: BookResolver },

    loadComponent: async () =>
      (await import('./pages/book-preview/book-preview.component')).BookPreviewComponent,
  },
];
