import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { StarRatingComponent } from '../../../shared/components/star-rating.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent],
  animations: [
    trigger('slideUp', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('80ms', [
            animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="container py-12" *ngIf="product">
      <nav class="breadcrumb">
        <a routerLink="/">Products</a>
        <span class="separator">/</span>
        <span class="active">{{ product.name }}</span>
      </nav>

      <section class="product-hero">
        <div class="image-section">
          <img [src]="product.image" [alt]="product.name" class="main-image animate-float">
        </div>
        
        <div class="info-section">
          <div class="header">
            <span class="category">{{ product.category }}</span>
            <h1>{{ product.name }}</h1>
            <div class="rating-summary">
              <app-star-rating [rating]="product.averageRating"></app-star-rating>
              <span class="stats">{{ product.averageRating }} • {{ product.reviewCount }} reviews</span>
            </div>
          </div>

          <p class="price">₹{{ product.price }}</p>
          
          <div class="description-box">
            <h3>Overview</h3>
            <p>{{ product.longDescription }}</p>
          </div>

          <div class="actions">
            <button class="btn btn-primary lg">Buy Now</button>
            <button class="btn btn-secondary lg" routerLink="/submit-review" [queryParams]="{ productId: product.id }">Write a Review</button>
          </div>
        </div>
      </section>

      <section class="reviews-section">
        <div class="section-header">
          <h2>Customer Reviews</h2>
          <div class="rating-overview">
            <div class="score-card">
              <span class="big-score">{{ product.averageRating }}</span>
              <app-star-rating [rating]="product.averageRating"></app-star-rating>
              <span class="total">Out of 5 stars</span>
            </div>
          </div>
        </div>

        <div class="reviews-list" [@slideUp]="product.reviews.length">
          <div *ngFor="let review of product.reviews" class="review-card card">
            <div class="review-header">
              <div class="user-info">
                <div class="avatar">{{ review.userName.charAt(0) }}</div>
                <div>
                  <h4 class="user-name">{{ review.userName }}</h4>
                  <p class="review-date">{{ review.date | date: 'mediumDate' }}</p>
                </div>
              </div>
              <app-star-rating [rating]="review.rating"></app-star-rating>
            </div>
            <p class="review-text">{{ review.comment }}</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .breadcrumb { display: flex; gap: 0.5rem; margin-bottom: 2rem; font-size: 0.875rem; color: var(--text-muted); }
    .breadcrumb a { text-decoration: none; color: inherit; transition: var(--transition); }
    .breadcrumb a:hover { color: var(--zinc-900); }
    .breadcrumb .separator { color: var(--zinc-300); }
    
    .product-hero { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 4rem; 
      margin-bottom: 6rem;
    }
    .main-image { width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); border: 1px solid var(--border); object-fit: cover; aspect-ratio: 4/3; }
    
    .category { font-size: 0.8125rem; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1rem; display: block; }
    .info-section h1 { font-size: 3.5rem; line-height: 1.1; margin-bottom: 1rem; color: var(--zinc-900); font-weight: 900; }
    .rating-summary { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .stats { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
    .price { 
      font-size: 3rem; 
      font-weight: 900; 
      background: var(--primary-vibrant);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 2.5rem; 
    }
    
    .description-box h3 { font-size: 0.875rem; margin-bottom: 1rem; text-transform: uppercase; color: var(--zinc-400); letter-spacing: 0.15em; }
    .description-box p { color: var(--zinc-600); font-size: 1.125rem; line-height: 1.8; margin-bottom: 2.5rem; }
    
    .actions { display: flex; gap: 1rem; }
    .btn.lg { padding: 1rem 2.5rem; font-size: 1.125rem; }

    .reviews-section { border-top: 1px solid var(--border); padding-top: 4rem; }
    .section-header { margin-bottom: 3.5rem; display: flex; justify-content: space-between; align-items: center; }
    .section-header h2 { font-size: 2.5rem; color: var(--zinc-900); }
    
    .score-card { text-align: center; background: var(--zinc-50); padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); }
    .big-score { font-size: 4rem; font-weight: 800; display: block; line-height: 1; margin-bottom: 0.75rem; color: var(--zinc-900); }
    .total { font-size: 0.875rem; color: var(--text-muted); display: block; margin-top: 0.5rem; }

    .reviews-list { display: flex; flex-direction: column; gap: 2rem; }
    .review-card { padding: 2rem; background: white; border: 1px solid var(--border); }
    .review-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .user-info { display: flex; gap: 1.25rem; align-items: center; }
    .avatar { width: 44px; height: 44px; background: var(--zinc-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--zinc-600); }
    .user-name { font-size: 1.125rem; margin: 0; color: var(--zinc-900); }
    .review-date { font-size: 0.875rem; color: var(--text-muted); margin: 0; }
    .review-text { font-size: 1.125rem; color: var(--zinc-700); line-height: 1.7; }

    @media (max-width: 1024px) {
      .product-hero { grid-template-columns: 1fr; gap: 2rem; }
      .info-section h1 { font-size: 2.5rem; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product?: Product;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productService.getProductById(params['id']).subscribe(p => {
        this.product = p;
      });
    });
  }
}
