import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product, Review } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products_v1_indian_v2'; // New key for freshness
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private readonly INITIAL_PRODUCTS: Product[] = [
    {
      id: '1',
      name: 'boAt Rockerz 450 Pro',
      description: 'Superior wireless audio with 70-hour playback and ASAP Charge technology.',
      longDescription: `Experience the signature sound of India's leading audio brand. Rockerz 450 Pro features 40mm drivers, comfortable memory foam ear cushions, and a build quality designed for every Indian lifestyle.`,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop',
      category: 'Audio',
      averageRating: 4.8,
      reviewCount: 4502,
      price: 1999,
      reviews: [
        { id: 'r1', userName: 'Rohan Sharma', rating: 5, comment: 'Killer bass and amazing battery life. Best budget headphones in India!', date: new Date() },
        { id: 'r2', userName: 'Priya Verma', rating: 4, comment: 'Very comfortable for long calls, but charging cable could be longer.', date: new Date(Date.now() - 86400000) }
      ]
    },
    {
      id: '2',
      name: 'Cosmic Byte GK-16 Firefly',
      description: 'Tenkeyless mechanical keyboard with Outemu Blue switches and RGB lighting.',
      longDescription: `Perfect for Indian gamers, this TKL keyboard offers premium tactile feedback at an unbeatable value. Features 18 RGB modes and a durable braided cable.`,
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop',
      category: 'Peripherals',
      averageRating: 4.6,
      reviewCount: 1205,
      price: 2499,
      reviews: [
        { id: 'r3', userName: 'Aniket Gupta', rating: 5, comment: 'Budget mechanical heaven. The RGB is super bright!', date: new Date() }
      ]
    },
    {
      id: '3',
      name: 'Noise ColorFit Pulse 4',
      description: '1.85-inch display smartwatch with Bluetooth calling and SpO2 monitoring.',
      longDescription: `India's most loved smartwatch series. Features a huge vibrant display, 150+ watch faces, and comprehensive health tracking including stress and sleep monitoring.`,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop',
      category: 'Wearables',
      averageRating: 4.4,
      reviewCount: 3200,
      price: 2999,
      reviews: []
    },
    {
      id: '4',
      name: 'Zebronics Zeb-Max Pro',
      description: 'Full-size mechanical keyboard with real RGB and heavy-duty build.',
      longDescription: `A powerhouse for both gamers and professionals. Features suspended keycaps and a dedicated wrist rest.`,
      image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600&auto=format&fit=crop',
      category: 'Peripherals',
      averageRating: 4.5,
      reviewCount: 890,
      price: 3499,
      reviews: []
    },
    {
      id: '5',
      name: 'Sleepwell Ergo Comfort',
      description: 'Breathable ergonomic mesh chair with adaptive lumbar support.',
      longDescription: `Designed for the Indian summer, featuring high-quality breathable mesh and a synchronized tilt mechanism for maximum comfort during work from home.`,
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop',
      category: 'Furniture',
      averageRating: 4.7,
      reviewCount: 456,
      price: 12499,
      reviews: []
    },
    {
      id: '6',
      name: 'SanDisk Extreme Portable SSD',
      description: '2TB Rugged External SSD with 1050MB/s speeds.',
      longDescription: `Professional-grade storage that's water and dust resistant. Perfect for travel and high-capacity backups.`,
      image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=600&auto=format&fit=crop',
      category: 'Storage',
      averageRating: 4.9,
      reviewCount: 230,
      price: 18999,
      reviews: []
    },
    {
      id: '7',
      name: 'Wakefit Ortho Memory Foam',
      description: 'Advanced support mattress with 7-zone body contouring.',
      longDescription: `Engineered for deep sleep. The Ortho Memory Foam ensures proper spinal alignment and pressure point relief for a restful night.`,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
      category: 'Furniture',
      averageRating: 4.8,
      reviewCount: 15200,
      price: 9999,
      reviews: []
    },
    {
      id: '8',
      name: 'DigiTek DTR 550LW Tripod',
      description: 'Lightweight professional tripod for mobile and cameras.',
      longDescription: `A household name for Indian creators. Multi-purpose tripod with a maximum load capacity of 5kg and height of 170cm.`,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
      category: 'Photography',
      averageRating: 4.3,
      reviewCount: 2100,
      price: 1499,
      reviews: []
    },
    {
      id: '9',
      name: 'OnePlus Bullets Wireless Z2',
      description: 'High-performance in-ear buds with 30-hour battery and deep bass.',
      longDescription: `Fast pairing and incredible sound isolation. The Z2 series is the go-to choice for premium wireless audio on a budget.`,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
      category: 'Audio',
      averageRating: 4.7,
      reviewCount: 8900,
      price: 1799,
      reviews: []
    },
    {
      id: '10',
      name: 'Boat Stone 1200',
      description: '14W Portable Bluetooth speaker with RGB and TWS function.',
      longDescription: `Rugged, water-resistant, and packing a punch. Stone 1200 is the ultimate party companion for Indian outdoor events.`,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop',
      category: 'Audio',
      averageRating: 4.5,
      reviewCount: 1200,
      price: 3499,
      reviews: []
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initData();
  }

  private initData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved).map((p: any) => ({
            ...p,
            reviews: p.reviews.map((r: any) => ({ ...r, date: new Date(r.date) }))
          }));
          this.productsSubject.next(parsed);
        } catch (e) {
          console.error('Error parsing saved products', e);
          this.productsSubject.next(this.INITIAL_PRODUCTS);
        }
      } else {
        this.saveToStorage(this.INITIAL_PRODUCTS);
      }
    } else {
      this.productsSubject.next(this.INITIAL_PRODUCTS);
    }
  }

  private saveToStorage(products: Product[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }
    this.productsSubject.next(products);
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  addReview(productId: string, review: Omit<Review, 'id' | 'date'>): Observable<Product> {
    const products = this.productsSubject.value;
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) throw new Error('Product not found');

    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date()
    };

    const updatedProduct = { ...products[index] };
    updatedProduct.reviews = [newReview, ...updatedProduct.reviews];
    updatedProduct.reviewCount = updatedProduct.reviews.length;
    updatedProduct.averageRating = Number((updatedProduct.reviews.reduce((acc, curr) => acc + curr.rating, 0) / updatedProduct.reviewCount).toFixed(1));

    const updatedProducts = [...products];
    updatedProducts[index] = updatedProduct;
    this.saveToStorage(updatedProducts);
    
    return of(updatedProduct).pipe(delay(800));
  }
}
