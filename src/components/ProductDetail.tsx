import { X, Star, ShoppingCart, Minus, Plus, MapPin, Mountain, Droplets, Award } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useState } from "react";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-coffee-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide animate-[fadeIn_0.2s_ease]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-coffee-700" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-cream-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-sm font-medium text-coffee-700 rounded-full">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-warm-600 uppercase tracking-wider">
                {product.origin}
              </span>
              <span className="text-coffee-300">·</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-warm-500 text-warm-500" />
                <span className="text-sm font-medium text-coffee-600">{product.rating}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-coffee-900 mb-2">
              {product.name}
            </h2>

            <p className="text-sm text-coffee-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
                <Mountain className="w-4 h-4 text-coffee-500" />
                <div>
                  <p className="text-[10px] text-coffee-400 uppercase tracking-wider">Altitud</p>
                  <p className="text-xs font-medium text-coffee-700">{product.altitude}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
                <Droplets className="w-4 h-4 text-coffee-500" />
                <div>
                  <p className="text-[10px] text-coffee-400 uppercase tracking-wider">Proceso</p>
                  <p className="text-xs font-medium text-coffee-700">{product.process}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
                <MapPin className="w-4 h-4 text-coffee-500" />
                <div>
                  <p className="text-[10px] text-coffee-400 uppercase tracking-wider">Origen</p>
                  <p className="text-xs font-medium text-coffee-700">{product.origin}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
                <Award className="w-4 h-4 text-coffee-500" />
                <div>
                  <p className="text-[10px] text-coffee-400 uppercase tracking-wider">Tueste</p>
                  <p className="text-xs font-medium text-coffee-700">{product.roast}</p>
                </div>
              </div>
            </div>

            {/* Flavor notes */}
            <div className="mb-6">
              <p className="text-xs font-medium text-coffee-500 uppercase tracking-wider mb-2">
                Notas de cata
              </p>
              <div className="flex flex-wrap gap-2">
                {product.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1.5 bg-warm-50 border border-warm-200 text-warm-700 text-xs font-medium rounded-full"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Price and quantity */}
            <div className="mt-auto pt-4 border-t border-coffee-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-coffee-900">
                    €{product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-coffee-500 ml-2">/ {product.weight}</span>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-2 bg-cream-100 rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-coffee-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-coffee-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-coffee-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-coffee-800 hover:bg-coffee-900 text-white hover:shadow-lg hover:shadow-coffee-800/20"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "¡Añadido al carrito!" : `Añadir al carrito — €${(product.price * quantity).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
