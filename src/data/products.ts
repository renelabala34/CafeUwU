export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  roast: string;
  price: number;
  weight: string;
  description: string;
  flavorNotes: string[];
  altitude: string;
  process: string;
  image: string;
  rating: number;
  inStock: boolean;
}

export const categories = [
  "Todos",
  "Origen Único",
  "Blend",
  "Descafeinado",
  "Edición Especial",
];

export const products: Product[] = [
  {
    id: 1,
    name: "Etiopía Yirgacheffe",
    origin: "Etiopía",
    category: "Origen Único",
    roast: "Ligero",
    price: 18.50,
    weight: "250g",
    description: "Un café excepcional de la región de Yirgacheffe con notas florales y cítricas que deleitan el paladar. Cultivado a gran altitud por pequeños productores que cuidan cada detalle del proceso.",
    flavorNotes: ["Jazmín", "Bergamota", "Limón", "Miel"],
    altitude: "1,900 - 2,200 m",
    process: "Lavado",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 2,
    name: "Colombia Huila",
    origin: "Colombia",
    category: "Origen Único",
    roast: "Medio",
    price: 16.00,
    weight: "250g",
    description: "De las montañas del Huila colombiano llega este café equilibrado y dulce. Con un cuerpo sedoso y acidez brillante, es perfecto para quienes buscan complejidad en cada taza.",
    flavorNotes: ["Caramelo", "Naranja", "Chocolate con leche", "Nuez"],
    altitude: "1,600 - 1,900 m",
    process: "Lavado",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 3,
    name: "Blend Aurora",
    origin: "Brasil & Guatemala",
    category: "Blend",
    roast: "Medio-Oscuro",
    price: 14.00,
    weight: "250g",
    description: "Nuestra mezcla insignia combina la dulzura brasileña con la complejidad guatemalteca. Ideal para espresso y métodos de filtrado, ofrece un perfil robusto y reconfortante.",
    flavorNotes: ["Chocolate negro", "Avellana", "Panela", "Ciruela"],
    altitude: "1,200 - 1,800 m",
    process: "Natural / Lavado",
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 4,
    name: "Kenya AA Nyeri",
    origin: "Kenia",
    category: "Origen Único",
    roast: "Medio",
    price: 21.00,
    weight: "250g",
    description: "Un café vibrante y complejo de las tierras altas de Nyeri. Su acidez jugosa y cuerpo deno lo convierten en una experiencia sensorial única para los amantes del café de especialidad.",
    flavorNotes: ["Grosella negra", "Tomate", "Pomelo", "Caña de azúcar"],
    altitude: "1,700 - 2,000 m",
    process: "Lavado",
    image: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=400&fit=crop",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 5,
    name: "Descafeinado Swiss Water",
    origin: "México",
    category: "Descafeinado",
    roast: "Medio",
    price: 15.50,
    weight: "250g",
    description: "Descafeinado con el método Swiss Water que preserva todos los sabores sin químicos. Perfecto para disfrutar en cualquier momento del día sin comprometer la calidad.",
    flavorNotes: ["Cacao", "Almendra", "Vainilla", "Galleta"],
    altitude: "1,100 - 1,400 m",
    process: "Swiss Water®",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 6,
    name: "Geisha Panamá Esmeralda",
    origin: "Panamá",
    category: "Edición Especial",
    roast: "Ligero",
    price: 45.00,
    weight: "100g",
    description: "La joya de la corona del café mundial. Esta Geisha de la finca Esmeralda ofrece una experiencia extraordinaria con notas florales y frutales que evolucionan con cada sorbo. Producción extremadamente limitada.",
    flavorNotes: ["Rosa", "Durazno", "Té de jazmín", "Papaya"],
    altitude: "1,600 - 1,800 m",
    process: "Lavado",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop",
    rating: 5.0,
    inStock: true,
  },
];
