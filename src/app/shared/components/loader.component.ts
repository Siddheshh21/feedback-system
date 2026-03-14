import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container" [class.overlay]="overlay">
      <div class="spinner"></div>
      <p *ngIf="message" class="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,0.8);
      z-index: 999;
      backdrop-filter: blur(4px);
    }
    .spinner {
      width: 3rem;
      height: 3rem;
      border: 4px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .message {
      margin-top: 1rem;
      color: var(--text-muted);
      font-weight: 500;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  `]
})
export class LoaderComponent {
  @Input() message = 'Loading...';
  @Input() overlay = false;
}
