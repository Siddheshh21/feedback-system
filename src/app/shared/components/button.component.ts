import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || loading"
      [class]="'btn btn-' + variant + ' ' + customClass"
      (click)="onClick.emit($event)"
    >
      <span *ngIf="loading" class="spinner"></span>
      <ng-content *ngIf="!loading"></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.625rem 1.25rem;
      font-weight: 600;
      border-radius: var(--radius);
      gap: 0.5rem;
      min-height: 44px;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
    .btn-secondary { background: var(--surface); border: 1px solid var(--border); color: var(--text-main); }
    .btn-secondary:hover:not(:disabled) { background: var(--background); }
    .btn-danger { background: var(--danger); color: white; }
    .btn-danger:hover:not(:disabled) { opacity: 0.9; }
    .btn-text { color: var(--primary); }
    .btn-text:hover:not(:disabled) { background: rgba(99, 102, 241, 0.05); }
    
    .spinner {
      width: 1.25rem;
      height: 1.25rem;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .btn-secondary .spinner { border-top-color: var(--primary); }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'text' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() customClass = '';
  @Output() onClick = new EventEmitter<MouseEvent>();
}
