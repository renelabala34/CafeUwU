import { X, ShoppingCart, Minus, Plus, Clock, MapPin, Tag } from "lucide-react";
import { MenuItem, businessInfo } from "../data/menu";
import { useCart } from "../context/CartContext";
import { useState } from "react";

interface MenuItemDetailProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemDetail({ item, onClose }: MenuItemDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const typeLabel = item.type === "sin_freir" ? "Sin freír" : "Preparado";
  const typeColor = item.type === "sin_freir"
    ? "bg-warm-100 text-warm-700"
    : "bg-olive-100 text-olive-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-tomato-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide animate-[fadeIn_0.2s_ease]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-tomato-700" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Visual */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-gradient-to-br from-cream-100 to-warm-100 flex items-center justify-center">
            <span className="text-8xl sm:text-9xl">{item.emoji}</span>
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${typeColor}`}>
                {typeLabel}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-tomato-500 uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-tomato-900 mb-3">
              {item.name}
            </h2>

            <p className="text-sm text-tomato-700 leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
                <Tag className="w-4 h-4 text-tomato-500" />
                <div>
                  <p className="text-[10px] text-tomato-400 uppercase tracking-wider">Unidad</p>
                  <p className="text-xs font-semibold text-tomato-700">{item.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
                <Clock className="w-4 h-4 text-tomato-500" />
                <div>
                  <p className="text-[10px] text-tomato-400 uppercase tracking-wider">Entrega</p>
                  <p className="text-xs font-semibold text-tomato-700">{businessInfo.lead_time_hours}h</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
                <MapPin className="w-4 h-4 text-tomato-500" />
                <div>
                  <p className="text-[10px] text-tomato-400 uppercase tracking-wider">Zona</p>
                  <p className="text-xs font-semibold text-tomato-700">{businessInfo.delivery_zone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
                <ShoppingCart className="w-4 h-4 text-tomato-500" />
                <div>
                  <p className="text-[10px] text-tomato-400 uppercase tracking-wider">Envío</p>
                  <p className="text-xs font-semibold text-tomato-700">${businessInfo.delivery_fee} CUP</p>
                </div>
              </div>
            </div>

            {/* Price and quantity */}
            <div className="mt-auto pt-4 border-t border-tomato-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-black text-tomato-700">${item.price}</span>
                  <span className="text-sm text-tomato-500 ml-2">CUP</span>
                </div>

                <div className="flex items-center gap-2 bg-cream-100 rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-tomato-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-tomato-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-tomato-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
                  added
                    ? "bg-olive-600 text-white"
                    : "bg-tomato-600 hover:bg-tomato-700 text-white hover:shadow-lg hover:shadow-tomato-600/20"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "¡Añadido!" : `Añadir — $${item.price * quantity} CUP`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
