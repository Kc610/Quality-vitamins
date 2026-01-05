

export enum Category {
  AMINO = 'Amino Acids & Blends',
  PRE_WORKOUT = 'Pre-Workout Supplements',
  PROTEINS = 'Proteins & Blends',
  NATURAL_EXTRACTS = 'Natural Extracts',
  SKIN_BEAUTY = 'Personal Care and Beauty',
  PET_WELLNESS = 'Pet',
  SPECIALTY = 'Specialty Supplements',
  FOOD_BEV = 'Food & Beverages',
  BUNDLES = 'Product Bundles'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  salePrice?: number;
  description: string;
  longDescription?: string;
  ingredients?: string;
  suggestedUse?: string;
  benefits?: string[];
  image: string;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  stockLevel?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: {
    label: string;
    value: string;
    recommendation: Category;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  citations?: { uri: string; title: string; }[];
}