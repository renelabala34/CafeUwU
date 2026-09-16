import { ShoppingCart, Eye } from "lucide-react";
import { MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";

interface MenuItemCardProps {
  item: MenuItem;
  onViewDetail: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onViewDetail }: MenuItemCardProps) {
  const { addToCart } = useCart();

  const typeLabel = item.type === "sin_freir" ? "Sin freír" : "Preparado";
  const typeColor = item.type === "sin_freir"
    ? "bg-warm-100 text-warm-700 border-warm-200"
    : "bg-olive-100 text-olive-700 border-olive-200";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-tomato-100/60 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Emoji / Visual */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-cream-100 to-warm-100 flex items-center justify-center">
        <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500">
          {item.emoji}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-tomato-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Type badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full border ${typeColor}`}>
          {typeLabel}
        </span>

        {/* Quick view */}
        <button
          onClick={() => onViewDetail(item)}
          className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
          <Eye className="w-4 h-4 text-tomato-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-tomato-900 text-sm sm:text-base leading-tight mb-1">
          {item.name}
        </h3>
        <p className="text-xs text-tomato-500 mb-3">{item.category}</p>
        <p className="text-xs text-tomato-600/70 line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        {/* Price and Add */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-tomato-100/60">
          <div>
            <span className="text-lg sm:text-xl font-black text-tomato-700">
              ${item.price}
            </span>
            <span className="text-xs text-tomato-400 ml-1">CUP</span>
          </div>
          <button
            onClick={() => addToCart(item)}
            className="flex items-center gap-1.5 px-3 py-2 bg-tomato-600 hover:bg-tomato-700 text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-tomato-600/20 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
