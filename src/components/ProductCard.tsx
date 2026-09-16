import { ShoppingCart, Star, Eye } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { addToCart } = useCart();

  const roastColor = {
    "Ligero": "bg-amber-100 text-amber-800",
    "Medio": "bg-orange-100 text-orange-800",
    "Medio-Oscuro": "bg-rose-100 text-rose-800",
    "Oscuro": "bg-red-100 text-red-800",
  }[product.roast] || "bg-coffee-100 text-coffee-800";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-coffee-100/80 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-cream-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-coffee-700 rounded-full">
          {product.category}
        </span>

        {/* Quick view button */}
        <button
          onClick={() => onViewDetail(product)}
          className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
          <Eye className="w-4 h-4 text-coffee-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-coffee-900 text-sm sm:text-base leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="w-3.5 h-3.5 fill-warm-500 text-warm-500" />
            <span className="text-xs font-medium text-coffee-600">{product.rating}</span>
          </div>
        </div>

        <p className="text-xs text-coffee-500 mb-3">{product.origin} · {product.weight}</p>

        {/* Flavor notes */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.flavorNotes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="px-2 py-0.5 bg-cream-100 text-coffee-600 text-[10px] sm:text-xs rounded-full border border-cream-200"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Roast level */}
        <div className="mb-4">
          <span className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ${roastColor}`}>
            Tueste {product.roast}
          </span>
        </div>

        {/* Price and Add to cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-coffee-100/60">
          <div>
            <span className="text-lg sm:text-xl font-bold text-coffee-900">
              €{product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 px-3 py-2 bg-coffee-800 hover:bg-coffee-900 text-white text-xs sm:text-sm font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-coffee-800/20 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
