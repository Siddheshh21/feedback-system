import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) 
  },
  { 
    path: 'products/:id', 
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'submit-review',
    loadComponent: () => import('./features/reviews/review-form/review-form.component').then(m => m.ReviewFormComponent)
  },
  { path: '**', redirectTo: '' }
];
