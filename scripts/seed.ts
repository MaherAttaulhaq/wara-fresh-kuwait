import { connectDB } from "../src/lib/db";
import { Product } from "../src/models/Product";

const products = [
  {
    name: "Wara Fresh Milk",
    slug: "wara-fresh-milk",
    category: "milk",
    description:
      "Pure, fresh milk straight from our farms to your home. Rich in vitamins and calcium for a healthy start to your day.",
    nutrition: {
      servingSize: "100 g",
      energy: "60 kcal / 250 kj",
      fat: "3.0 g",
      protein: "3.1 g",
      carbohydrate: "4.7 g",
      vitaminA: "2000 i.u./L",
      vitaminD3: "400 i.u./L",
      calcium: "100 mg",
    },
    price: 0.750,
    inStock: true,
    featured: true,
    images: [],
  },
  {
    name: "Wara Fresh Yoghurt",
    slug: "wara-fresh-yoghurt",
    category: "yogurt",
    description:
      "Creamy and nutritious yogurt made from the freshest milk. Perfect for breakfast, snacks, or cooking.",
    nutrition: {
      servingSize: "100 g",
      energy: "68 kcal / 287 kj",
      fat: "3.0 g",
      protein: "4.0 g",
      carbohydrate: "6.2 g",
    },
    price: 0.500,
    inStock: true,
    featured: true,
    images: [],
  },
  {
    name: "Wara Fresh Laban",
    slug: "wara-fresh-laban",
    category: "laban",
    description:
      "Traditional refreshing laban drink made from fresh milk. A healthy and delicious dairy beverage for every meal.",
    nutrition: {
      servingSize: "100 ml",
      energy: "60 kcal / 250 kj",
      fat: "3.0 g",
      protein: "3.1 g",
      carbohydrate: "4.7 g",
      vitaminA: "2000 i.u./L",
      vitaminD3: "400 i.u./L",
      calcium: "100 mg",
    },
    price: 0.350,
    inStock: true,
    featured: true,
    images: [],
  },
];

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB");

  for (const product of products) {
    await Product.findOneAndUpdate({ slug: product.slug }, product, {
      upsert: true,
      new: true,
    });
    console.log(`Upserted: ${product.name}`);
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
