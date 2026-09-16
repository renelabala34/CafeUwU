import { useState, useMemo } from "react";
import { CartProvider } from "./context/CartContext";
import { MenuProvider, useMenu } from "./context/MenuContext";
import { sections, businessInfo, MenuItem } from "./data/menu";
import Header from "./components/Header";
import MenuItemCard from "./components/MenuItemCard";
import MenuItemDetail from "./components/MenuItemDetail";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./components/Checkout";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import { SlidersHorizontal, MapPin, Clock, Phone, Instagram, Flame, Leaf } from "lucide-react";

type Page = "shop" | "checkout" | "admin-login" | "admin-panel";

function ShopContent() {
  const { items } = useMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("todos");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState<Page>("shop");
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("admin_auth") === "true"
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSection =
        selectedSection === "todos" || item.type === selectedSection;
      return matchesSearch && matchesSection;
    });
  }, [searchQuery, selectedSection, items]);

  if (page === "admin-login") {
    return (
      <AdminLogin
        onLogin={() => { setIsAuthenticated(true); setPage("admin-panel"); }}
        onBack={() => setPage("shop")}
      />
    );
  }

  if (page === "admin-panel") {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLogin={() => { setIsAuthenticated(true); setPage("admin-panel"); }}
          onBack={() => setPage("shop")}
        />
      );
    }
    return (
      <AdminPanel
        onLogout={() => { sessionStorage.removeItem("admin_auth"); setIsAuthenticated(false); setPage("shop"); }}
        onBackToShop={() => setPage("shop")}
      />
    );
  }

  if (page === "checkout") {
    return <Checkout onBack={() => setPage("shop")} />;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header
        onCartClick={() => setCartOpen(true)}
        onAdminClick={() => setPage("admin-login")}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-tomato-700 via-tomato-600 to-warm-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-cream-300 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-warm-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
                {businessInfo.delivery_zone}
              </span>
              <span className="flex items-center gap-1 text-cream-100 text-[10px] sm:text-xs">
                <Clock className="w-3 h-3" />
                {businessInfo.order_hours.open} - {businessInfo.order_hours.close}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 sm:mb-4">
              I'MAS
              <span className="block text-cream-100 text-xl sm:text-3xl lg:text-4xl font-bold mt-1 sm:mt-2">
                {businessInfo.tagline}
              </span>
            </h2>
            <p className="text-cream-100/90 text-xs sm:text-base leading-relaxed max-w-lg mb-4 sm:mb-6">
              Comida casera cubana lista para disfrutar. Croquetas, medallones, tamales, bananas y más. 
              Entrega en {businessInfo.delivery_zone} en {businessInfo.lead_time_hours}h.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-[10px] sm:text-xs font-medium">
                <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Sin freír
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-[10px] sm:text-xs font-medium">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Preparados
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {businessInfo.address}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-tomato-500" />
            <span className="text-sm font-bold text-tomato-800">Categorías</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  selectedSection === section.id
                    ? "bg-tomato-600 text-white shadow-md shadow-tomato-600/20"
                    : "bg-white text-tomato-700 border border-tomato-200/60 hover:border-tomato-300 hover:bg-cream-50"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-sm text-tomato-600">
            {filteredItems.length} {filteredItems.length === 1 ? "producto" : "productos"}
            {searchQuery && (
              <span> para "<span className="font-bold text-tomato-800">{searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onViewDetail={setSelectedItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="text-lg font-black text-tomato-900 mb-2">No encontramos resultados</h3>
            <p className="text-sm text-tomato-600 max-w-sm mx-auto">
              Intenta con otros términos o selecciona otra categoría.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedSection("todos"); }}
              className="mt-4 px-6 py-2.5 bg-tomato-600 text-white text-sm font-bold rounded-full hover:bg-tomato-700 transition-colors"
            >
              Ver todo el menú
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-tomato-900 text-cream-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-tomato-500 to-warm-500 flex items-center justify-center">
                  <span className="text-white font-black text-sm">I'M</span>
                </div>
                <div>
                  <span className="font-black text-xl text-white">I'MAS</span>
                  <p className="text-xs text-cream-300/70">{businessInfo.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-cream-300/70 leading-relaxed">
                Comida casera cubana en Alamar. Croquetas, medallones, tamales y más.
              </p>
            </div>
            <div>
              <h4 className="font-black text-white mb-3 text-sm">Contacto</h4>
              <ul className="space-y-2 text-sm text-cream-300/70">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {businessInfo.address}
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 shrink-0" /> {businessInfo.order_hours.open} - {businessInfo.order_hours.close}
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" /> +53 5680 3949
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 shrink-0" /> {businessInfo.social}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-white mb-3 text-sm">Pago y entrega</h4>
              <p className="text-sm text-cream-300/70 leading-relaxed mb-3">
                {businessInfo.payment_policy}
              </p>
              <p className="text-xs text-cream-400/50 mb-4">
                Envío: ${businessInfo.delivery_fee} CUP · Zona: {businessInfo.delivery_zone}
              </p>
              <button
                onClick={() => setPage("admin-login")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cream-300/80 hover:text-white bg-cream-800/30 hover:bg-cream-800/50 rounded-full transition-all"
              >
                Panel Admin
              </button>
            </div>
          </div>
          <div className="border-t border-cream-800/50 mt-10 pt-6 text-center">
            <p className="text-xs text-cream-400/50">© 2026 I'MAS Alamar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedItem && (
        <MenuItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {/* Cart */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setPage("checkout"); }}
      />
    </div>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <ShopContent />
      </CartProvider>
    </MenuProvider>
  );
}
