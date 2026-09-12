export type ProductCategory =
  | 'Tous'
  | 'Cahiers'
  | 'Géométrie'
  | 'Arts créatifs'
  | 'Sacs'
  | 'Écriture'
  | 'Calculatrices';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  subCategoryTag: string; // e.g. "PAPETERIE FINE • CAHIERS"
  price: number; // in FCFA
  currency: string; // "F" or "FCFA"
  rating: number;
  reviewsCount: number;
  description: string;
  specs: ProductSpec[];
  images: string[];
  iconType: 'pen' | 'book' | 'geometry' | 'calculator' | 'bag' | 'art';
  colorVariant?: string;
  inStock: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
}

export interface FilterOptions {
  category: ProductCategory;
  minPrice: number;
  maxPrice: number;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  inStockOnly: boolean;
}
