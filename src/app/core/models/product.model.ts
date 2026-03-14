export interface Review {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  category: string;
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
  price: number;
}
