import { useState, useMemo } from "react";
import { CartProvider } from "./context/CartContext";
import { ProductProvider, useProducts } from "./context/ProductContext";
import { categories, Product } from "./data/products";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductDetail from "./components/ProductDetail";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./components/Checkout";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import { SlidersHorizontal, Coffee, Shield } from "lucide-react";

type Page = "shop" | "checkout" | "confirmation" | "admin-login" | "admin-panel";

function ShopContent() {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState<Page>("shop");
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("admin_auth") === "true"
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavorNotes.some((note) =>
          note.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  // Admin Login page
  if (page === "admin-login") {
    return (
      <AdminLogin
        onLogin={() => {
          setIsAuthenticated(true);
          setPage("admin-panel");
        }}
        onBack={() => setPage("shop")}
      />
    );
  }

  // Admin Panel page
  if (page === "admin-panel") {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLogin={() => {
            setIsAuthenticated(true);
            setPage("admin-panel");
          }}
          onBack={() => setPage("shop")}
        />
      );
    }
    return (
      <AdminPanel
        onLogout={() => {
          sessionStorage.removeItem("admin_auth");
          setIsAuthenticated(false);
          setPage("shop");
        }}
        onBackToShop={() => setPage("shop")}
      />
    );
  }

  // Checkout page
  if (page === "checkout") {
    return <Checkout onBack={() => setPage("shop")} />;
  }

  // Shop page
  return (
    <div className="min-h-screen bg-cream-50">
      <Header
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-warm-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-cream-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-warm-400 text-sm font-medium uppercase tracking-widest mb-3">
              Tostado artesanal
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 leading-tight mb-4">
              Café de especialidad
              <span className="block text-warm-400">directo a tu taza</span>
            </h2>
            <p className="text-cream-200/80 text-sm sm:text-base leading-relaxed max-w-lg">
              Seleccionamos los mejores granos de origen de las fincas más prestigiosas del mundo. 
              Cada lote es tostado con precisión para resaltar su perfil único.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-coffee-500" />
            <span className="text-sm font-medium text-coffee-700">Categorías</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-coffee-800 text-white shadow-md shadow-coffee-800/20"
                    : "bg-white text-coffee-600 border border-coffee-200/60 hover:border-coffee-300 hover:bg-cream-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-coffee-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
            {searchQuery && (
              <span>
                {" "}
                para "<span className="font-medium text-coffee-700">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-7 h-7 text-coffee-300" />
            </div>
            <h3 className="text-lg font-semibold text-coffee-800 mb-2">
              No encontramos resultados
            </h3>
            <p className="text-sm text-coffee-500 max-w-sm mx-auto">
              Intenta con otros términos de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Todos");
              }}
              className="mt-4 px-6 py-2.5 bg-coffee-800 text-white text-sm font-medium rounded-full hover:bg-coffee-900 transition-colors"
            >
              Ver todos los cafés
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-coffee-900 text-cream-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-coffee-900" />
                </div>
                <span className="font-bold text-cream-50">Origen</span>
              </div>
              <p className="text-sm text-cream-300/70 leading-relaxed">
                Café de especialidad seleccionado y tostado con pasión desde 2020.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-cream-100 mb-3 text-sm">Productos</h4>
              <ul className="space-y-2 text-sm text-cream-300/70">
                <li className="hover:text-cream-100 cursor-pointer transition-colors">Origen Único</li>
                <li className="hover:text-cream-100 cursor-pointer transition-colors">Blends</li>
                <li className="hover:text-cream-100 cursor-pointer transition-colors">Ediciones Especiales</li>
                <li className="hover:text-cream-100 cursor-pointer transition-colors">Descafeinados</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cream-100 mb-3 text-sm">Empresa</h4>
              <ul className="space-y-2 text-sm text-cream-300/70">
                <li className="hover:text-cream-100 cursor-pointer transition-colors">Sobre nosotros</li>
                <li className="hover:text-cream-100 cursor-pointer transition-colors">Nuestro proceso</li>
                <li className="hover:text-cream-100 cursor-pointer transition-colors">Sostenibilidad</li>
                <li className="hover:text-cream-100 cursor-pointer transition-colors">Contacto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cream-100 mb-3 text-sm">Contacto</h4>
              <ul className="space-y-2 text-sm text-cream-300/70">
                <li>hola@origencoffee.es</li>
                <li>+53 5680 3949</li>
                <li>La Habana, Cuba</li>
              </ul>
              <button
                onClick={() => setPage("admin-login")}
                className="mt-4 flex items-center gap-1.5 text-xs text-cream-400/50 hover:text-cream-200 transition-colors"
              >
                <Shield className="w-3 h-3" />
                Admin
              </button>
            </div>
          </div>
          <div className="border-t border-cream-800/50 mt-10 pt-6 text-center">
            <p className="text-xs text-cream-400/50">
              © 2026 Origen Coffee. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setPage("checkout");
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <ShopContent />
      </CartProvider>
    </ProductProvider>
  );
}
