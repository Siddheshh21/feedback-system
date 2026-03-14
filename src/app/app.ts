import { Component, inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            left: 0,
            width: '100%',
            opacity: 0,
            transform: 'translateY(10px)',
          })
        ], { optional: true }),
        query(':enter', [
          animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="bg-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>
    <nav class="navbar">
      <div class="container nav-content">
        <div class="brand" routerLink="/">
          <span class="logo-icon">P</span>
          <span class="logo-text">ProductPilot</span>
        </div>
        
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Products</a>
          <a routerLink="/submit-review" routerLinkActive="active">Submit Review</a>
        </div>
      </div>
    </nav>

    <main [@routeAnimations]="getRouteAnimationData(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </main>

    <footer class="footer">
      <div class="container footer-content">
        <p>© 2026 ProductPilot. Built for professionals.</p>
        <div class="footer-links">
          <a>Privacy</a>
          <a>Terms</a>
          <a>Contact</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      height: 72px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    .logo-icon {
      width: 32px;
      height: 32px;
      background: var(--zinc-900);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-weight: 800;
      font-size: 1.25rem;
    }
    .logo-text {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--zinc-900);
      letter-spacing: -0.02em;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    .nav-links a {
      text-decoration: none;
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      transition: var(--transition);
      position: relative;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--zinc-900);
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -1.5rem;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--zinc-900);
    }
    .footer {
      padding: 4rem 0;
      border-top: 1px solid var(--border);
      margin-top: 4rem;
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
    }
    .footer-links {
      display: flex;
      gap: 1.5rem;
    }
    main { position: relative; min-height: calc(100vh - 72px - 200px); }
  `]
})
export class AppComponent {
  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    document.documentElement.style.setProperty('--mx', `${x}px`);
    document.documentElement.style.setProperty('--my', `${y}px`);
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
