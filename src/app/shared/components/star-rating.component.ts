import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stars" [class.interactive]="interactive">
      <span 
        *ngFor="let star of stars; let i = index" 
        class="star"
        [class.filled]="i < rating"
        [class.hovered]="i < hoverRating"
        (mouseenter)="onMouseEnter(i + 1)"
        (mouseleave)="onMouseLeave()"
        (click)="onRate(i + 1)"
      >
        ★
      </span>
    </div>
  `,
  styles: [`
    .stars { display: inline-flex; gap: 4px; color: var(--zinc-300); font-size: 1.25rem; }
    .star { cursor: default; transition: transform 0.2s, color 0.2s; }
    .star.filled { color: #fbbf24; }
    .interactive .star { cursor: pointer; }
    .interactive .star:hover { transform: scale(1.3); }
    .interactive .star.hovered { color: #fcd34d; }
  `]
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() interactive = false;
  @Output() rated = new EventEmitter<number>();

  stars = new Array(5);
  hoverRating = 0;

  onMouseEnter(val: number) {
    if (this.interactive) this.hoverRating = val;
  }

  onMouseLeave() {
    if (this.interactive) this.hoverRating = 0;
  }

  onRate(val: number) {
    if (this.interactive) {
      this.rating = val;
      this.rated.emit(val);
    }
  }
}
