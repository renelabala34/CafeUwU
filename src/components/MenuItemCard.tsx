import { ShoppingCart, Eye } from "lucide-react";
import { MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";

interface MenuItemCardProps {
  item: MenuItem;
  onViewDetail: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onViewDetail }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = !item.inStock;

  const typeLabel = item.type === "sin_freir" ? "Sin freír" : "Preparado";
  const typeColor = item.type === "sin_freir"
    ? "bg-warm-100 text-warm-700 border-warm-200"
    : "bg-olive-100 text-olive-700 border-olive-200";

  return (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl border overflow-hidden transition-all duration-300 flex flex-col ${
      isOutOfStock 
        ? "border-gray-200 opacity-75 hover:opacity-90" 
        : "border-tomato-100/60 hover:-translate-y-1"
    }`}>
      {/* Emoji / Visual */}
      <div className={`relative aspect-square flex items-center justify-center ${
        isOutOfStock 
          ? "bg-gradient-to-br from-gray-100 to-gray-200" 
          : "bg-gradient-to-br from-cream-100 to-warm-100"
      }`}>
        <span className={`text-5xl sm:text-6xl md:text-7xl transition-transform duration-500 ${
          isOutOfStock ? "grayscale" : "group-hover:scale-110"
        }`}>
          {item.emoji}
        </span>
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-tomato-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        
        {/* Type badge */}
        <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs font-semibold rounded-full border ${typeColor}`}>
          {typeLabel}
        </span>

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
              AGOTADO
            </span>
          </div>
        )}

        {/* Quick view */}
        <button
          onClick={() => onViewDetail(item)}
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tomato-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
        <h3 className={`font-bold text-xs sm:text-sm md:text-base leading-tight mb-0.5 sm:mb-1 line-clamp-2 ${
          isOutOfStock ? "text-gray-500" : "text-tomato-900"
        }`}>
          {item.name}
        </h3>
        <p className={`text-[10px] sm:text-xs mb-2 sm:mb-3 truncate ${
          isOutOfStock ? "text-gray-400" : "text-tomato-500"
        }`}>
          {item.category}
        </p>
        <p className={`text-[10px] sm:text-xs line-clamp-2 mb-3 sm:mb-4 flex-1 hidden sm:block ${
          isOutOfStock ? "text-gray-400" : "text-tomato-600/70"
        }`}>
          {item.description}
        </p>

        {/* Price and Add */}
        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-tomato-100/60">
          <div>
            <span className={`text-base sm:text-lg md:text-xl font-black ${
              isOutOfStock ? "text-gray-400" : "text-tomato-700"
            }`}>
              ${item.price}
            </span>
            <span className={`text-[10px] sm:text-xs ml-0.5 sm:ml-1 ${
              isOutOfStock ? "text-gray-300" : "text-tomato-400"
            }`}>
              CUP
            </span>
          </div>
          {isOutOfStock ? (
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-8 h-8 sm:w-auto sm:px-3 sm:py-2 bg-gray-300 text-gray-500 text-xs sm:text-sm font-semibold rounded-full cursor-not-allowed">
              <span className="hidden sm:inline">Agotado</span>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item)}
              className="flex items-center justify-center gap-1 sm:gap-1.5 w-8 h-8 sm:w-auto sm:px-3 sm:py-2 bg-tomato-600 hover:bg-tomato-700 text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-tomato-600/20 active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Añadir</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
