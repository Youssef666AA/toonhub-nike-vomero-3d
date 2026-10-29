export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  JPY: { code: 'JPY', symbol: '¥', rate: 154.0 },
};

export interface ProductColorway {
  id: string;
  name: string;
  edition: string;
  tag: string;
  price: number;
  retailPrice: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'VAULT_EXCLUSIVE' | 'SOLD_OUT';
  stockCount: number;
  src: string;
  bgGradient: string;
  accentColor: string;
  hex: string;
  releaseDate: string;
  specs: {
    cushion: string;
    weight: string;
    drop: string;
    tech: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  colorway: string;
  size: string;
  price: number;
  src: string;
  quantity: number;
  isCustom?: boolean;
  customConfig?: {
    mesh: string;
    swoosh: string;
    midsole: string;
    outsole: string;
    laces: string;
  };
}

export interface ReviewItem {
  id: string;
  author: string;
  handle: string;
  location: string;
  verified: boolean;
  rating: number;
  date: string;
  headline: string;
  content: string;
  shoeColorway: string;
  sizeBought: string;
  tags?: string[];
  metrics: {
    comfort: number;
    fit: string;
    support: number;
  };
}
