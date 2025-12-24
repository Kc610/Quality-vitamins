
import { Category, Product, QuizQuestion } from './types';

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
    salePrice: 15.99,
    description: 'Support normal serotonin levels and emotional well-being.',
    longDescription: '5-HTP occurs naturally in the body. Typically, people produce enough for regular functioning, but some require supplementation. 5-HTP dietary supplements aid in supporting normal serotonin levels in the brain and emotional well-being.',
    ingredients: 'Calcium (as Calcium Carbonate), 5-Hydroxytryptophan (from Griffonia simplicifolia seed extract), Gelatin (capsule), Magnesium Stearate.',
    suggestedUse: 'Take two (2) capsules once a day as a dietary supplement. For best results, take 20-30 min before a meal with an 8oz glass of water.',
    benefits: ['Supports Serotonin', 'Emotional Well-being', 'Clean, Holistic Formula'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019636-generated-label-image-0.jpg?v=1758045639',
    tags: ['Amino', 'Mood'],
    isBestSeller: true,
    stockLevel: 5
  },
  {
    id: 'whey-isolate-chocolate',
    name: 'Advanced 100% Whey Protein Isolate',
    category: Category.PROTEINS,
    price: 49.90,
    description: 'Premium chocolate whey isolate for muscle development and recovery.',
    longDescription: 'This premium protein supplement is specially formulated to provide your body with top-tier protein that supports muscle development and recovery. Savor the rich, chocolatey goodness with every scoop.',
    ingredients: 'Whey Protein Isolate, Cocoa Powder, MCT Oil Powder, Natural Flavors, Sunflower Lecithin, Apple Pectin Powder, Sea Salt, Stevia Extract, Silicon Dioxide.',
    suggestedUse: 'Mix two (2) scoops with 6-8 oz. of water or your preferred beverage daily.',
    benefits: ['22g Pure Protein', 'Fast Absorbing', 'Supports Digestion'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044351820-generated-label-image-0.jpg?v=1758045651',
    tags: ['Protein', 'Muscle'],
    isBestSeller: true,
    isNew: true
  },
  {
    id: 'alpha-energy',
    name: 'Alpha Energy Men\'s Vitality',
    category: Category.SPECIALTY,
    price: 40.90,
    description: 'Support vitality, muscle mass, and energy levels without testosterone.',
    longDescription: 'Formulated with magnesium, zinc, tribulus terrestris, and saw palmetto to promote men\'s health and well-being. Enhance lean muscle mass and energy levels thought to support weight management.',
    ingredients: 'Magnesium, Zinc, Tribulus Terrestris, Chrysin, Horny Goat Weed, Longjack, Saw Palmetto, Hawthorn Berries.',
    suggestedUse: 'Take three (3) capsules before bedtime.',
    benefits: ['Muscle Support', 'Energy Boost', 'Cardiovascular Wellness'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108339-generated-label-image-0.jpg?v=1758045643',
    tags: ['Men', 'Vitality']
  },
  {
    id: 'ashwagandha',
    name: 'Organic Ashwagandha',
    category: Category.NATURAL_EXTRACTS,
    price: 23.90,
    description: 'Ancient Ayurvedic herb for stress management and calm.',
    longDescription: 'Ashwagandha is an ancient herb used in Ayurvedic medicine. It is most well-known as a powerful adaptogen that helps individuals calm their stress levels and support overall health.',
    ingredients: 'Organic Ashwagandha (Withania somnifera)(root), Organic Black Pepper (Piper nigrum)(fruit), pullulan capsules.',
    suggestedUse: 'Take one (1) capsule twice a day. For best results, take 20-30 min before a meal.',
    benefits: ['Stress Support', 'Adaptogenic Power', 'Immune System Support'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044025355-generated-label-image-0.jpg?v=1758045639',
    tags: ['Stress', 'Herbal'],
    isBestSeller: true
  },
  {
    id: 'bcaa-honeydew',
    name: 'BCAA Post Workout (Honeydew)',
    category: Category.AMINO,
    price: 35.90,
    description: 'Build lean muscle and aid recovery with 5000mg of BCAAs.',
    longDescription: 'A powerful blend of 5000mg branched-chain amino acids and L-Glutamine, essential for muscle growth and repair. Features an ideal 2:1:1 ratio.',
    ingredients: 'L-Glutamine, BCAA 2:1:1, Vitamin B6, Citric Acid, Natural Flavors, Potassium Citrate, Sucralose.',
    suggestedUse: 'Mix 1/2 a scoop (6.5g) in 8-10 oz of cold beverage. Best taken pre or post-workout.',
    benefits: ['Lean Muscle Growth', 'Enhanced Recovery', 'Nitrogen Retention'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044091975-generated-label-image-0.jpg?v=1758045642',
    tags: ['Recovery', 'Amino'],
    isNew: true
  },
  {
    id: 'creatine-monohydrate',
    name: 'Pure Creatine Monohydrate',
    category: Category.AMINO,
    price: 33.90,
    description: 'Unlock full athletic potential and energy production.',
    longDescription: 'Creatine plays a crucial role in energy production within your muscles, enabling you to push harder and perform better. Supplementing helps bridge the gap for optimal protein synthesis.',
    ingredients: '100% Pure Creatine Monohydrate.',
    suggestedUse: 'Initial loading phase: 1 scoop 4 times daily for 5 days. Maintenance: 1-2 servings daily.',
    benefits: ['Performance Edge', 'Muscle Energy', 'High Quality Sourcing'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044066488-generated-label-image-0.jpg?v=1758045640',
    tags: ['Strength', 'Energy'],
    stockLevel: 3
  },
  {
    id: 'kojic-turmeric-soap',
    name: 'Kojic Acid & Turmeric Soap',
    category: Category.SKIN_BEAUTY,
    price: 14.99,
    description: 'Revitalizing soap for radiant complexion and skin hydration.',
    longDescription: 'Formulated to combine the skin-revitalizing properties of Turmeric with Kojic Acid to promote a radiant complexion. Coconut Oil, Shea Butter, and Mango Butter deeply nourish the skin.',
    ingredients: 'Organic Coconut Oil, Organic Shea Butter, Turmeric Powder, Kojic Acid, Lemon Oil, Cocoa Butter.',
    suggestedUse: 'Wet skin, lather in circular motion. Leave on for 30-60 seconds before rinsing.',
    benefits: ['Brightening Formula', 'Nourishing Hydration', 'Sustainable Ingredients'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044005525-generated-label-image-0.jpg?v=1758045637',
    tags: ['Skin', 'Beauty'],
    salePrice: 9.99
  },
  {
    id: 'energy-powder-melon',
    name: 'Energy Powder (Melon Creamsicle)',
    category: Category.PRE_WORKOUT,
    price: 34.99,
    description: 'Balanced energy boost without the crash, featuring caffeine and L-theanine.',
    longDescription: 'Precisely formulated with electrolytes and nutrients to support hydration and overall wellness while maintaining peak performance during physical activities.',
    ingredients: 'Thiamin, Riboflavin, Niacin, B6, B12, Natural Caffeine (Green Tea), L-theanine, Electrolytes.',
    suggestedUse: 'Mix one scoop with 6-10 ounces of water daily.',
    benefits: ['Sustained Energy', 'Sugar-Free', 'Hydration Support'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758061341311-generated-label-image-0.jpg?v=1758061376',
    tags: ['Energy', 'Focus']
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "What is your primary fitness goal?",
    options: [
      { label: "Build Muscle", value: "muscle", recommendation: Category.PROTEINS },
      { label: "Lose Fat", value: "fat-loss", recommendation: Category.AMINO },
      { label: "Boost Energy", value: "energy", recommendation: Category.PRE_WORKOUT },
      { label: "General Wellness", value: "wellness", recommendation: Category.NATURAL_EXTRACTS }
    ]
  },
  {
    id: 2,
    text: "How often do you exercise per week?",
    options: [
      { label: "0-2 times", value: "low", recommendation: Category.NATURAL_EXTRACTS },
      { label: "3-4 times", value: "med", recommendation: Category.AMINO },
      { label: "5+ times", value: "high", recommendation: Category.PRE_WORKOUT }
    ]
  },
  {
    id: 3,
    text: "What is your dietary preference?",
    options: [
      { label: "No preference", value: "any", recommendation: Category.PROTEINS },
      { label: "Plant-Based", value: "vegan", recommendation: Category.PROTEINS },
      { label: "Keto/Low Carb", value: "keto", recommendation: Category.NATURAL_EXTRACTS }
    ]
  }
];
