import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { StarRatingComponent } from '../../../shared/components/star-rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent],
  template: `
    <div class="product-card card" [routerLink]="['/products', product.id]">
      <div class="image-wrapper">
        <img [src]="product.image" [alt]="product.name">
        <div class="category-badge">{{ product.category }}</div>
      </div>
      <div class="content">
        <div class="header">
          <h3>{{ product.name }}</h3>
          <span class="price">₹{{ product.price }}</span>
        </div>
        <p class="description">{{ product.description }}</p>
        <div class="meta">
          <app-star-rating [rating]="product.averageRating"></app-star-rating>
          <span class="stats">{{ product.averageRating }} ({{ product.reviewCount }} reviews)</span>
        </div>
        <button class="btn btn-secondary w-full mt-4">View Reviews</button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .image-wrapper {
      position: relative;
      height: 200px;
      overflow: hidden;
      background: var(--zinc-100);
    }
    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .product-card:hover .image-wrapper img {
      transform: scale(1.1);
    }
    .category-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.35rem 0.85rem;
      background: var(--primary-vibrant);
      backdrop-filter: blur(4px);
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 800;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }
    .content { padding: 1.5rem; display: flex; flex-direction: column; flex: 1; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
    .header h3 { font-size: 1.125rem; margin: 0; color: var(--zinc-900); }
    .price { 
      font-weight: 800; 
      background: var(--primary-vibrant);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 1.125rem;
    }
    .description { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .meta { margin-top: auto; display: flex; align-items: center; gap: 0.75rem; }
    .stats { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
    .w-full { width: 100%; }
    .mt-4 { margin-top: 1rem; }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
}
