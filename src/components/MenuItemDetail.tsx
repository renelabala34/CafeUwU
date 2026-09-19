import { X, ShoppingCart, Minus, Plus, Clock, MapPin, Tag } from "lucide-react";
import { MenuItem, businessInfo } from "../data/menu";
import { useCart } from "../context/CartContext";
import { useCategories } from "../context/CategoryContext";
import { useState } from "react";

interface MenuItemDetailProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemDetail({ item, onClose }: MenuItemDetailProps) {
  const { addToCart } = useCart();
  const { categories } = useCategories();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const isOutOfStock = !item.inStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Buscar la categoría del producto basado en el type
  const category = categories.find(cat => cat.type === item.type);
  const typeLabel = category ? category.name : (item.type === "sin_freir" ? "Sin freír" : "Preparado");
  const typeColor = category 
    ? `bg-${category.color}-100 text-${category.color}-700`
    : (item.type === "sin_freir"
        ? "bg-warm-100 text-warm-700"
        : "bg-olive-100 text-olive-700");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-tomato-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-[fadeIn_0.2s_ease]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-tomato-700" />
        </button>

        <div className="grid md:grid-cols-2 gap-0 h-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
          {/* Visual */}
          <div className={`relative h-32 sm:h-48 md:h-full flex items-center justify-center ${
            isOutOfStock 
              ? "bg-gradient-to-br from-gray-100 to-gray-200" 
              : "bg-gradient-to-br from-cream-100 to-warm-100"
          }`}>
            <span className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl ${isOutOfStock ? "grayscale" : ""}`}>
              {item.emoji}
            </span>
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex gap-2">
              <span className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-full ${typeColor}`}>
                {typeLabel}
              </span>
              {isOutOfStock && (
                <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-bold rounded-full bg-red-600 text-white">
                  AGOTADO
                </span>
              )}
            </div>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-gray-900/20" />
            )}
          </div>

          {/* Details */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider ${
                isOutOfStock ? "text-gray-400" : "text-tomato-500"
              }`}>
                {item.quantity} unidades
              </span>
            </div>

            <h2 className={`text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3 ${
              isOutOfStock ? "text-gray-500" : "text-tomato-900"
            }`}>
              {item.name}
            </h2>

            <p className={`text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 ${
              isOutOfStock ? "text-gray-400" : "text-tomato-700"
            }`}>
              {item.description}
            </p>

            {/* Info */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-cream-50 rounded-lg sm:rounded-xl">
                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tomato-500" />
                <div>
                  <p className="text-[9px] sm:text-[10px] text-tomato-400 uppercase tracking-wider">Cantidad</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-tomato-700">{item.quantity} unidades</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-cream-50 rounded-lg sm:rounded-xl">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tomato-500" />
                <div>
                  <p className="text-[9px] sm:text-[10px] text-tomato-400 uppercase tracking-wider">Entrega</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-tomato-700">{businessInfo.lead_time_hours}h</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-cream-50 rounded-lg sm:rounded-xl">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tomato-500" />
                <div>
                  <p className="text-[9px] sm:text-[10px] text-tomato-400 uppercase tracking-wider">Zona</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-tomato-700">{businessInfo.delivery_zone}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-cream-50 rounded-lg sm:rounded-xl">
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tomato-500" />
                <div>
                  <p className="text-[9px] sm:text-[10px] text-tomato-400 uppercase tracking-wider">Envío</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-tomato-700">${businessInfo.delivery_fee} CUP</p>
                </div>
              </div>
            </div>

            {/* Price and quantity */}
            <div className="mt-auto pt-3 sm:pt-4 border-t border-tomato-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <span className={`text-2xl sm:text-3xl font-black ${
                    isOutOfStock ? "text-gray-400" : "text-tomato-700"
                  }`}>
                    ${item.price}
                  </span>
                  <span className={`text-xs sm:text-sm ml-1 sm:ml-2 ${
                    isOutOfStock ? "text-gray-300" : "text-tomato-500"
                  }`}>
                    CUP
                  </span>
                </div>

                {!isOutOfStock && (
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-cream-100 rounded-full p-0.5 sm:p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    >
                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-tomato-600" />
                    </button>
                    <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-tomato-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-tomato-600" />
                    </button>
                  </div>
                )}
              </div>

              {isOutOfStock ? (
                <div className="w-full py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed">
                  Producto agotado
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
                    added
                      ? "bg-olive-600 text-white"
                      : "bg-tomato-600 hover:bg-tomato-700 text-white hover:shadow-lg hover:shadow-tomato-600/20"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {added ? "¡Añadido!" : `Añadir — $${item.price * quantity} CUP`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
