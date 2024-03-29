import { ProductData } from "./ProductBox";

const BACKEND = true;
// Fetches results from the backend if true,
// If not uses the hardcoded values as shown bellow

// Generate random ratings for default products when the component mounts
function getRandomRating() {
  // Ensure the rating is a number between 0 and 5
  return Math.min(5, Math.random() * 6);
}

export const defaultProductsData: ProductData[] = [
  {
    price: 1000,
    shipping: 50,
    condition: true,
    seller: "Apple",
    description: "A laptop",
    num_ratings: 100,
    rating: getRandomRating(),
    photos: ["https://via.placeholder.com/150"],
    seller_num_ratings: 1000,
    seller_avg_ratings: 4.5,
    measurements: "16 in",
    quantity: 10,
    lastUpdatedAt: "2021-10-10",
    url: "https://www.apple.com/macbook-pro-14/",
    isNew: true,
  },
  {
    price: 500,
    shipping: 25,
    condition: true,
    seller: "Samsung",
    description: "A phone",
    num_ratings: 200,
    rating: getRandomRating(),
    photos: ["https://via.placeholder.com/150"],
    seller_num_ratings: 500,
    seller_avg_ratings: 4.0,
    measurements: "6 in",
    quantity: 20,
    lastUpdatedAt: "2021-10-10",
    url: "https://www.samsung.com/galaxy-s21/",
    isNew: false,
  },
  {
    price: 200,
    shipping: 10,
    condition: true,
    seller: "Amazon",
    description: "A smart speaker",
    num_ratings: 50,
    rating: getRandomRating(),
    photos: ["https://via.placeholder.com/150"],
    seller_num_ratings: 200,
    seller_avg_ratings: 4.2,
    measurements: "5 in",
    quantity: 30,
    lastUpdatedAt: "2021-10-10",
    url: "https://www.amazon.com/echo-dot/",
    isNew: true,
  },
  {
    price: 1500,
    shipping: 100,
    condition: true,
    seller: "Dell",
    description: "A gaming laptop",
    num_ratings: 300,
    rating: getRandomRating(),
    photos: ["https://via.placeholder.com/150"],
    seller_num_ratings: 1000,
    seller_avg_ratings: 4.7,
    measurements: "17 in",
    quantity: 5,
    lastUpdatedAt: "2021-10-10",
    url: "https://www.dell.com/alienware/",
    isNew: false,
  },
  {
    price: 300,
    shipping: 20,
    condition: true,
    seller: "Google",
    description: "A smartwatch",
    num_ratings: 150,
    rating: getRandomRating(),
    photos: ["https://via.placeholder.com/150"],
    seller_num_ratings: 500,
    seller_avg_ratings: 4.3,
    measurements: "1.5 in",
    quantity: 15,
    lastUpdatedAt: "2021-10-10",
    url: "https://www.google.com/pixel-watch/",
    isNew: true,
  },
  {
    price: 400,
    shipping: 30,
    condition: true,
    seller: "Microsoft",
    description: "A gaming console",
    num_ratings: 250,
    rating: getRandomRating(),
    photos: ["https://via.placeholder.com/150"],
    seller_num_ratings: 1000,
    seller_avg_ratings: 4.6,
    measurements: "12 in",
    quantity: 25,
    lastUpdatedAt: "2021-10-10",
    url: "https://www.microsoft.com/xbox-series-x/",
    isNew: false,
  },
  // ... other products
];

export default async function getProducts(query = "macbook pro m1 16in"): Promise<ProductData[]> {
  if (!BACKEND) {
    return defaultProductsData
  }

  const encoded = encodeURIComponent(query);
  const res = await fetch(`http://10.110.240.198:5001/search?query=${encoded}`)
  const data = await res.json()

  return data
}
