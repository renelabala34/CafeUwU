import { Search, ShoppingCart, Coffee, Menu, X, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";

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
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-coffee-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-coffee-800 flex items-center justify-center">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-cream-200" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-coffee-900 tracking-tight">
                Origen
              </h1>
              <p className="text-[10px] sm:text-xs text-coffee-500 -mt-0.5 tracking-widest uppercase">
                Café de Especialidad
              </p>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
              <input
                type="text"
                placeholder="Buscar café por nombre, origen..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-100 border border-coffee-200/60 rounded-full text-sm text-coffee-800 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onAdminClick}
              className="p-2.5 rounded-full hover:bg-coffee-100 transition-colors group"
              title="Panel de administración"
            >
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-coffee-700 group-hover:text-coffee-900 transition-colors" />
            </button>
            <button
              onClick={onCartClick}
              className="relative p-2.5 rounded-full hover:bg-coffee-100 transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-coffee-700 group-hover:text-coffee-900 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-warm-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-[bounce_0.3s_ease]">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2.5 rounded-full hover:bg-coffee-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-coffee-700" />
              ) : (
                <Menu className="w-5 h-5 text-coffee-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
              <input
                type="text"
                placeholder="Buscar café..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-100 border border-coffee-200/60 rounded-full text-sm text-coffee-800 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
