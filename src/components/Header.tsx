import { Search, ShoppingCart, X, Shield, MapPin, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { businessInfo } from "../data/menu";

interface HeaderProps {
  onCartClick: () => void;
  onAdminClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ onCartClick, onAdminClick, searchQuery, onSearchChange }: HeaderProps) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tomato-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-tomato-500 to-warm-500 flex items-center justify-center shadow-lg shadow-tomato-500/20">
              <span className="text-white font-black text-sm sm:text-base">I'M</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-tomato-700 tracking-tight">
                I'MAS
              </h1>
              <p className="text-[10px] sm:text-xs text-warm-600 -mt-0.5 font-medium">
                {businessInfo.tagline}
              </p>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tomato-300" />
              <input
                type="text"
                placeholder="Buscar en el menú..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-full text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onAdminClick}
              className="p-2.5 rounded-full hover:bg-tomato-50 transition-colors group"
              title="Panel de administración"
            >
              <Shield className="w-5 h-5 text-tomato-400 group-hover:text-tomato-700 transition-colors" />
            </button>
            <button
              onClick={onCartClick}
              className="relative p-2.5 rounded-full hover:bg-tomato-50 transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-tomato-600 group-hover:text-tomato-800 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-tomato-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-[bounceIn_0.3s_ease]">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2.5 rounded-full hover:bg-tomato-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buscar"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-tomato-700" />
              ) : (
                <Search className="w-5 h-5 text-tomato-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search & Info */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tomato-300" />
              <input
                type="text"
                placeholder="Buscar en el menú..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-full text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-tomato-600 px-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {businessInfo.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {businessInfo.order_hours.open} - {businessInfo.order_hours.close}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
