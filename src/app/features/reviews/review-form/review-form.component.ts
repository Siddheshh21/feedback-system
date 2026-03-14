import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { StarRatingComponent } from '../../../shared/components/star-rating.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StarRatingComponent, RouterModule],
  template: `
    <div class="container py-24 animate-fade-in">
      <div class="form-container">
        <header class="form-header">
          <h1>Share Your Experience</h1>
          <p>Your honest review helps others make better choices.</p>
        </header>

        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="card main-form">
          <div class="form-group mb-8">
            <label class="form-label">Select Product</label>
            <select formControlName="productId" class="form-input elegant">
              <option value="" disabled>Choose a product</option>
              <option *ngFor="let p of products" [value]="p.id">{{ p.name }}</option>
            </select>
          </div>

          <div class="form-group mb-8">
            <label class="form-label">How would you rate it?</label>
            <div class="rating-input-box">
              <app-star-rating 
                [rating]="reviewForm.get('rating')?.value || 0" 
                [interactive]="true"
                (rated)="onRate($event)"
              ></app-star-rating>
              <span class="rating-label">{{ getRatingLabel() }}</span>
            </div>
            <div *ngIf="submitted && reviewForm.get('rating')?.invalid" class="form-error">Please select a rating.</div>
          </div>

          <div class="form-group mb-8">
            <label class="form-label">Your Name</label>
            <input 
              type="text" 
              formControlName="userName" 
              class="form-input elegant" 
              placeholder="e.g. John Doe"
            >
            <div *ngIf="submitted && reviewForm.get('userName')?.invalid" class="form-error">Name is required.</div>
          </div>

          <div class="form-group mb-12">
            <label class="form-label">Your Comment</label>
            <textarea 
              formControlName="comment" 
              class="form-input elegant textarea" 
              rows="5" 
              placeholder="What did you like or dislike?"
            ></textarea>
            <div *ngIf="submitted && reviewForm.get('comment')?.invalid" class="form-error">Comment must be at least 10 characters.</div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary lg" routerLink="/">Cancel</button>
            <button type="submit" class="btn btn-primary lg" [disabled]="submitting">
              {{ submitting ? 'Submitting...' : 'Post Review' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .py-24 { padding: 6rem 0; }
    .form-container { max-width: 600px; margin: 0 auto; }
    .form-header { text-align: center; margin-bottom: 3rem; }
    .form-header h1 { font-size: 2.5rem; letter-spacing: -0.03em; margin-bottom: 0.5rem; color: var(--zinc-900); }
    .form-header p { color: var(--text-muted); font-size: 1.125rem; }
    
    .main-form { padding: 3rem; background: white; }
    .elegant { border-radius: 8px; border: 1px solid var(--border); padding: 1rem; font-size: 1rem; background: white; color: var(--zinc-900); }
    .textarea { resize: vertical; }
    
    .rating-input-box { display: flex; align-items: center; gap: 1.5rem; padding: 1rem; background: var(--zinc-50); border-radius: 8px; border: 1px solid var(--zinc-200); }
    .rating-label { font-size: 0.875rem; font-weight: 600; color: var(--primary); }
    
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 2rem; border-top: 1px solid var(--border); }
    .btn.lg { padding: 1rem 2rem; min-width: 140px; }
    .form-label { color: var(--zinc-700); font-weight: 600; margin-bottom: 0.5rem; display: block; font-size: 0.875rem; }

    .mb-8 { margin-bottom: 2rem; }
    .mb-12 { margin-bottom: 3rem; }
    .form-error { color: var(--danger); font-size: 0.8125rem; margin-top: 0.5rem; font-weight: 500; }
  `]
})
export class ReviewFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  products: any[] = [];
  submitting = false;
  submitted = false;

  reviewForm = this.fb.group({
    productId: ['', Validators.required],
    userName: ['', Validators.required],
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });

    const preSelectedProduct = this.route.snapshot.queryParams['productId'];
    if (preSelectedProduct) {
      this.reviewForm.patchValue({ productId: preSelectedProduct });
    }
  }

  onRate(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  getRatingLabel() {
    const r = this.reviewForm.get('rating')?.value;
    if (!r) return 'Select rating';
    const labels = ['Poor', 'Fair', 'Good', 'Great', 'Exceptional'];
    return labels[r - 1];
  }

  onSubmit() {
    this.submitted = true;
    if (this.reviewForm.valid) {
      this.submitting = true;
      const { productId, ...reviewData } = this.reviewForm.value;
      
      this.productService.addReview(productId!, reviewData as any).subscribe({
        next: (p) => {
          this.toastr.success('Review posted successfully!');
          this.router.navigate(['/products', p.id]);
        },
        error: () => {
          this.toastr.error('Something went wrong. Please try again.');
          this.submitting = false;
        }
      });
    }
  }
}
