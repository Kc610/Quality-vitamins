
import { Category, Product, QuizQuestion } from './types.ts';

export const COLORS = {
  primary: '#4CAF50',
  secondary: '#FF9800',
  dark: '#212121',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '5-htp',
    name: '5-HTP Serotonin Support',
    category: Category.AMINO,
    price: 19.90,
    description: 'Clean, holistic way to support normal serotonin levels and emotional well-being.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019636-generated-label-image-0.jpg?v=1758045639',
    tags: ['Mood', 'Amino'],
    isBestSeller: true
  },
  {
    id: 'whey-isolate-chocolate',
    name: 'Advanced 100% Whey Isolate',
    category: Category.PROTEINS,
    price: 49.90,
    salePrice: 42.00,
    description: 'Premium chocolate whey isolate for muscle development and rapid recovery.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044351820-generated-label-image-0.jpg?v=1758045651',
    tags: ['Protein', 'Muscle'],
    isNew: true
  },
  {
    id: 'alpha-energy',
    name: 'Alpha Energy Men\'s Vitality',
    category: Category.SPECIALTY,
    price: 40.90,
    description: 'Support vitality, muscle mass, and energy levels without testosterone.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108339-generated-label-image-0.jpg?v=1758045643',
    tags: ['Men', 'Vitality']
  },
  {
    id: 'ashwagandha',
    name: 'Organic Ashwagandha',
    category: Category.NATURAL_EXTRACTS,
    price: 23.90,
    description: 'Powerful adaptogen that helps individuals manage and calm stress levels.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044025355-generated-label-image-0.jpg?v=1758045639',
    tags: ['Stress', 'Herbal']
  },
  {
    id: 'bee-bread-powder',
    name: 'Bee Bread Powder',
    category: Category.NATURAL_EXTRACTS,
    price: 47.90,
    description: 'Concentrated bee bread, propolis, and royal jelly for smoothie optimization.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044324225-generated-label-image-0.jpg?v=1758045649',
    tags: ['Superfood', 'Vitality']
  },
  {
    id: 'beetroot-powder',
    name: 'Beetroot Performance Powder',
    category: Category.SPECIALTY,
    price: 35.90,
    description: 'Promotes healthy blood flow and circulation, ideal for post-workout recovery.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044337102-generated-label-image-0.jpg?v=1758045652',
    tags: ['Blood Flow', 'Endurance']
  },
  {
    id: 'birch-chaga-truffles',
    name: 'Birch Chaga Truffles',
    category: Category.NATURAL_EXTRACTS,
    price: 49.90,
    description: 'Rich source of fulvic and humic acids for gut health and immune support.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044160404-generated-label-image-0.jpg?v=1758045646',
    tags: ['Gut Health', 'Immune']
  },
  {
    id: 'creatine-mono',
    name: 'Creatine Monohydrate Elite',
    category: Category.AMINO,
    price: 33.90,
    description: 'Unlock full athletic potential by supporting muscle protein synthesis.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044066488-generated-label-image-0.jpg?v=1758045640',
    tags: ['Strength', 'Power']
  },
  {
    id: 'colostrum-capsules',
    name: 'Bovine Colostrum Capsules',
    category: Category.SPECIALTY,
    price: 35.00,
    description: 'Nutrient-dense immunoglobulins (IgG) for immune and gut lining integrity.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044348188-generated-label-image-0.jpg?v=1758045651',
    tags: ['Immune', 'Gut'],
    isBestSeller: true
  },
  {
    id: 'dog-dental-wipes',
    name: 'Doggie Dental Wipes',
    category: Category.PET_WELLNESS,
    price: 17.00,
    description: 'Easy alternative to brushing! pH balanced to match canine saliva.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044258202-generated-label-image-0.jpg?v=1758045648',
    tags: ['Pet', 'Dental']
  },
  {
    id: 'energy-powder-melon',
    name: 'Energy Powder (Melon Creamsicle)',
    category: Category.PRE_WORKOUT,
    price: 34.99,
    description: 'Balanced boost with caffeine and L-theanine for smooth, sustained lift.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758061341311-generated-label-image-0.jpg?v=1758061376',
    tags: ['Energy', 'Focus'],
    isNew: true
  },
  {
    id: 'fat-burner-mct',
    name: 'Fat Burner with MCT',
    category: Category.SPECIALTY,
    price: 33.90,
    description: 'Facilitates metabolic performance and weight loss via thermogenesis.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044104075-generated-label-image-0.jpg?v=1758045644',
    tags: ['Metabolism', 'Weight']
  },
  {
    id: 'mushroom-coffee-fusion',
    name: 'Mushroom Coffee Fusion',
    category: Category.FOOD_BEV,
    price: 19.90,
    description: 'Lion\'s Mane and Chaga infused Arabica for cognitive enhancement.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044046542-generated-label-image-0.jpg?v=1758045639',
    tags: ['Nootropic', 'Coffee'],
    isBestSeller: true
  },
  {
    id: 'nitric-shock',
    name: 'Nitric Shock Pre-Workout',
    category: Category.PRE_WORKOUT,
    price: 38.90,
    description: '23 advanced nutrients designed to push you beyond your limits.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044096655-generated-label-image-0.jpg?v=1758045643',
    tags: ['Pump', 'Strength']
  },
  {
    id: 'probiotic-40b',
    name: 'Probiotic 40 Billion',
    category: Category.SPECIALTY,
    price: 30.90,
    description: 'MAKTREK Bi-Pass Technology for superior gut health delivery.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044138371-generated-label-image-0.jpg?v=1758045645',
    tags: ['Gut', 'Immune']
  },
  {
    id: 'sea-moss',
    name: 'Sea Moss Wellness',
    category: Category.NATURAL_EXTRACTS,
    price: 25.90,
    description: 'Organic Bladderwrack and Burdock root for total biological immunity.',
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044215560-generated-label-image-0.jpg?v=1758045646',
    tags: ['Superfood', 'Detox']
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "What is your primary biological directive?",
    options: [
      { label: "Muscle Mass Dominance", value: "muscle", recommendation: Category.PROTEINS },
      { label: "Adipose Tissue Decimation", value: "fat-loss", recommendation: Category.SPECIALTY },
      { label: "Neural Clarity & Flow", value: "energy", recommendation: Category.PRE_WORKOUT },
      { label: "Longevity Optimization", value: "wellness", recommendation: Category.NATURAL_EXTRACTS }
    ]
  },
  {
    id: 2,
    text: "Define your training frequency:",
    options: [
      { label: "Maintenance (0-2 Sessions)", value: "low", recommendation: Category.NATURAL_EXTRACTS },
      { label: "Performance (3-4 Sessions)", value: "med", recommendation: Category.AMINO },
      { label: "Elite Output (5+ Sessions)", value: "high", recommendation: Category.PRE_WORKOUT }
    ]
  }
];
