
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
    longDescription: 'Our 5-HTP is derived from the seeds of the Griffonia simplicifolia plant. It serves as a direct precursor to serotonin, the neurotransmitter responsible for mood regulation, sleep cycles, and appetite suppression. By bypassing the rate-limiting step of tryptophan hydroxylase, our formula ensures rapid biological availability.',
    ingredients: '5-Hydroxytryptophan (from Griffonia simplicifolia), Vegetable Cellulose (capsule), Rice Flour.',
    suggestedUse: 'Take 1 capsule daily, preferably on an empty stomach before bedtime, or as directed by a healthcare professional.',
    benefits: ['Supports Emotional Balance', 'Promotes Deep Sleep Cycles', 'Natural Appetite Regulation', '99% Pure Plant Synthesis'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019636-generated-label-image-0.jpg?v=1758045639',
    tags: ['Mood', 'Neural Drive'],
    isBestSeller: true,
    stockLevel: 12
  },
  {
    id: 'whey-isolate-chocolate',
    name: 'Advanced 100% Whey Isolate',
    category: Category.PROTEINS,
    price: 49.90,
    salePrice: 42.00,
    description: 'Premium chocolate whey isolate for muscle development and rapid recovery.',
    longDescription: 'Engineered through cross-flow microfiltration (CFM), this isolate retains vital sub-fractions while eliminating fat and lactose. With 25g of pure protein per scoop and a complete BCAA profile, it is the gold standard for post-training biological reconstruction.',
    ingredients: 'Cold-Filtered Whey Protein Isolate, Natural Cocoa, Stevia Leaf Extract, Sunflower Lecithin.',
    suggestedUse: 'Mix 1 scoop with 8-10 oz of cold water or nut milk. Consume within 45 minutes post-workout.',
    benefits: ['Rapid Protein Synthesis', 'Lean Muscle Retention', 'Zero Bloat Formula', 'High Bio-Availability'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044351820-generated-label-image-0.jpg?v=1758045651',
    tags: ['Muscle', 'Tissue Repair'],
    isNew: true,
    stockLevel: 4
  },
  {
    id: 'alpha-energy',
    name: 'Alpha Energy Men\'s Vitality',
    category: Category.SPECIALTY,
    price: 40.90,
    description: 'Support vitality, muscle mass, and energy levels without exogenous hormones.',
    longDescription: 'A synergistic blend of Fenugreek, Tribulus Terrestris, and Zinc designed to optimize the body\'s natural endocrine environment. It focuses on increasing free testosterone availability and reducing cortisol-induced catabolism.',
    ingredients: 'Fenugreek Extract, Tribulus Terrestris, Zinc Citrate, Vitamin D3, Magnesium Aspartate.',
    suggestedUse: 'Take 2 capsules in the morning with food. Do not exceed 4 capsules in a 24-hour period.',
    benefits: ['Enhanced Natural Vitality', 'Improved Recovery Rate', 'Optimized Libido Support', 'Cortisol Regulation'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108339-generated-label-image-0.jpg?v=1758045643',
    tags: ['Vitality', 'Metabolic Edge']
  },
  {
    id: 'ashwagandha',
    name: 'Organic Ashwagandha',
    category: Category.NATURAL_EXTRACTS,
    price: 23.90,
    description: 'Powerful adaptogen that helps individuals manage and calm stress levels.',
    longDescription: 'Standardized to 5% Withanolides, our KSM-66 Ashwagandha is the most clinically studied version available. It modulates the HPA axis to lower serum cortisol levels and improve systemic resilience to physical and mental stressors.',
    ingredients: 'Organic Ashwagandha Root Extract (KSM-66), Black Pepper Extract (for absorption).',
    suggestedUse: 'Take 1 capsule twice daily with meals.',
    benefits: ['Reduces Serum Cortisol', 'Improves Sleep Quality', 'Supports Adrenal Health', 'Cognitive Resilience'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044025355-generated-label-image-0.jpg?v=1758045639',
    tags: ['Stress', 'Neural Drive'],
    isBestSeller: true
  },
  {
    id: 'bee-bread-powder',
    name: 'Bee Bread Powder',
    category: Category.NATURAL_EXTRACTS,
    price: 47.90,
    description: 'Concentrated bee bread, propolis, and royal jelly for smoothie optimization.',
    longDescription: 'Fermented by bees within the hive, Bee Bread (Perga) is 3x more bio-available than raw pollen. It is nature\'s most complete superfood, containing every essential amino acid, a vast array of vitamins, and unique enzymatic compounds.',
    ingredients: 'Natural Perga (Bee Bread), Lyophilized Royal Jelly, Propolis Extract.',
    suggestedUse: 'Add 1 teaspoon to your morning smoothie or yogurt.',
    benefits: ['Micro-Nutrient Density', 'Immune System Modulation', 'Enhanced Energy Metabolism', 'Gut Microbiome Support'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044324225-generated-label-image-0.jpg?v=1758045649',
    tags: ['Immune', 'Metabolic Edge']
  },
  {
    id: 'beetroot-powder',
    name: 'Beetroot Performance Powder',
    category: Category.SPECIALTY,
    price: 35.90,
    description: 'Promotes healthy blood flow and circulation, ideal for post-workout recovery.',
    longDescription: 'High-nitrate concentration derived from organic Beta vulgaris. Nitrates are converted to Nitric Oxide in the body, which vasodilates blood vessels, increasing oxygen delivery to working muscles and enhancing aerobic endurance.',
    ingredients: 'Organic Beetroot Powder, Malic Acid, Natural Black Cherry Flavor.',
    suggestedUse: 'Mix 1 scoop with water 30 minutes before exercise.',
    benefits: ['Nitric Oxide Booster', 'Improved VO2 Max', 'Lower Blood Pressure Support', 'Endurance Optimization'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044337102-generated-label-image-0.jpg?v=1758045652',
    tags: ['Endurance', 'Metabolic Edge']
  },
  {
    id: 'creatine-mono',
    name: 'Creatine Monohydrate Elite',
    category: Category.AMINO,
    price: 33.90,
    description: 'Unlock full athletic potential by supporting muscle protein synthesis.',
    longDescription: '200-mesh micronized creatine for maximum solubility. Creatine phosphate is the primary fuel source for ATP-PCr energy systems, allowing for increased power output during high-intensity short-duration activities.',
    ingredients: '100% Pure Micronized Creatine Monohydrate.',
    suggestedUse: 'Mix 1 scoop (5g) with water daily. No loading phase required.',
    benefits: ['Increased Peak Power', 'Cellular Hydration', 'Cognitive Function Support', 'Muscle Volume Expansion'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044066488-generated-label-image-0.jpg?v=1758045640',
    tags: ['Strength', 'Tissue Repair']
  },
  {
    id: 'mushroom-coffee-fusion',
    name: 'Mushroom Coffee Fusion',
    category: Category.FOOD_BEV,
    price: 19.90,
    description: 'Lion\'s Mane and Chaga infused Arabica for cognitive enhancement.',
    longDescription: 'Combine the ritual of coffee with the neural-optimizing power of medicinal mushrooms. Lion\'s Mane promotes Nerve Growth Factor (NGF) for focus, while Chaga provides the antioxidant base to prevent the jitters associated with raw caffeine.',
    ingredients: 'Organic Arabica Coffee, Lion\'s Mane Extract, Chaga Extract.',
    suggestedUse: 'Brew as you would normal coffee. Use 2 tablespoons per 8 oz of water.',
    benefits: ['Sustained Neural Focus', 'Zero Coffee Crash', 'Neuro-Protective Properties', 'Metabolic Kickstart'],
    image: 'https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044046542-generated-label-image-0.jpg?v=1758045639',
    tags: ['Nootropic', 'Neural Drive'],
    isBestSeller: true
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
