import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { ProductCardComponent } from './product-card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, SkeletonComponent, FormsModule],
  animations: [
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="container py-12 animate-fade-in">
      <header class="list-header">
        <div class="header-content">
          <h1>Curated Products</h1>
          <p>Discover top-rated tech vetted by the community.</p>
        </div>
        
        <div class="filter-bar">
          <div class="search-box">
            <div class="search-icon-wrapper">
              <span class="search-icon"></span>
            </div>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="filterProducts()"
              placeholder="Search products..."
            >
          </div>
          
          <div class="sort-box">
            <select [(ngModel)]="sortBy" (ngModelChange)="filterProducts()">
              <option value="featured">Featured</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>
          </div>
        </div>
      </header>

      <div *ngIf="loading" class="product-grid">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="skeleton-card">
          <app-skeleton height="200px" radius="10px 10px 0 0"></app-skeleton>
          <div class="p-4">
            <app-skeleton width="70%" height="1.25rem" class="mb-3"></app-skeleton>
            <app-skeleton width="100%" height="0.875rem" class="mb-2"></app-skeleton>
            <app-skeleton width="90%" height="0.875rem" class="mb-4"></app-skeleton>
            <app-skeleton width="50%" height="1rem"></app-skeleton>
          </div>
        </div>
      </div>

      <div *ngIf="!loading" [@staggerList]="filteredProducts.length" class="product-grid">
        <app-product-card 
          *ngFor="let product of filteredProducts" 
          [product]="product"
        ></app-product-card>
      </div>

      <div *ngIf="!loading && filteredProducts.length === 0" class="empty-state">
        <p>No products found matching your search.</p>
      </div>
    </div>
  `,
  styles: [`
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .list-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      margin-bottom: 3rem;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .header-content h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .header-content p { color: var(--text-muted); font-size: 1.125rem; }
    
    .filter-bar { display: flex; gap: 1rem; align-items: center; }
    .search-icon-wrapper { 
      position: absolute; 
      left: 1rem; 
      top: 50%; 
      transform: translateY(-50%); 
      width: 16px; 
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .search-icon { 
      width: 14px; 
      height: 14px; 
      border: 2px solid var(--zinc-400); 
      border-radius: 50%; 
      position: relative;
    }
    .search-icon::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 2px;
      background: var(--zinc-400);
      transform: rotate(45deg);
      bottom: -3px;
      right: -3px;
    }
    .search-box input { 
      width: 100%; 
      padding: 0.75rem 1rem 0.75rem 2.8rem; 
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      transition: var(--transition);
    }
    .search-box input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }
    
    .sort-box select {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      background: white;
      color: var(--zinc-700);
      cursor: pointer;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .skeleton-card { background: white; border-radius: 10px; border: 1px solid var(--border); }
    .p-4 { padding: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .empty-state { text-align: center; padding: 4rem; color: var(--text-muted); }

    @media (max-width: 640px) {
      .list-header { flex-direction: column; align-items: flex-start; }
      .search-box { min-width: 100%; }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  
  products: any[] = [];
  filteredProducts: any[] = [];
  loading = true;
  searchQuery = '';
  sortBy = 'featured';

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filterProducts();
      this.loading = false;
    });
  }

  filterProducts() {
    let filtered = [...this.products];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    if (this.sortBy === 'rating-high') {
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else if (this.sortBy === 'rating-low') {
      filtered.sort((a, b) => a.averageRating - b.averageRating);
    }

    this.filteredProducts = filtered;
  }
}
