import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [style.width]="width" [style.height]="height" [style.border-radius]="radius" class="skeleton"></div>
  `,
  styles: [`
    :host { display: block; line-height: 1; }
  `]
})
export class SkeletonComponent {
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() radius = '4px';
}
