import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import { Product } from "../data/products";
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ArrowLeft,
  Package,
  Search,
  X,
  Save,
  Image as ImageIcon,
} from "lucide-react";

interface AdminPanelProps {
  onLogout: () => void;
  onBackToShop: () => void;
}

const CATEGORIES = ["Origen Único", "Blend", "Descafeinado", "Edición Especial"];
const ROASTS = ["Ligero", "Medio", "Medio-Oscuro", "Oscuro"];

interface ProductForm {
  name: string;
  origin: string;
  category: string;
  roast: string;
  price: string;
  weight: string;
  description: string;
  flavorNotes: string;
  altitude: string;
  process: string;
  image: string;
  rating: string;
  inStock: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  origin: "",
  category: "Origen Único",
  roast: "Medio",
  price: "",
  weight: "250g",
  description: "",
  flavorNotes: "",
  altitude: "",
  process: "",
  image: "",
  rating: "4.5",
  inStock: true,
};

export default function AdminPanel({ onLogout, onBackToShop }: AdminPanelProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProductForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      origin: product.origin,
      category: product.category,
      roast: product.roast,
      price: product.price.toString(),
      weight: product.weight,
      description: product.description,
      flavorNotes: product.flavorNotes.join(", "),
      altitude: product.altitude,
      process: product.process,
      image: product.image,
      rating: product.rating.toString(),
      inStock: product.inStock,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      origin: formData.origin,
      category: formData.category,
      roast: formData.roast,
      price: parseFloat(formData.price) || 0,
      weight: formData.weight,
      description: formData.description,
      flavorNotes: formData.flavorNotes
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
      altitude: formData.altitude,
      process: formData.process,
      image: formData.image || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
      rating: parseFloat(formData.rating) || 4.5,
      inStock: formData.inStock,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-coffee-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToShop}
                className="p-2 hover:bg-coffee-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-coffee-700" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-coffee-900">Panel Admin</h1>
                <p className="text-xs text-coffee-500">Gestión de productos</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-coffee-600 hover:text-coffee-800 hover:bg-coffee-100 rounded-full transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-coffee-100/60">
            <p className="text-xs text-coffee-500 uppercase tracking-wider">Total productos</p>
            <p className="text-2xl font-bold text-coffee-900 mt-1">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-coffee-100/60">
            <p className="text-xs text-coffee-500 uppercase tracking-wider">En stock</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {products.filter((p) => p.inStock).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-coffee-100/60">
            <p className="text-xs text-coffee-500 uppercase tracking-wider">Precio medio</p>
            <p className="text-2xl font-bold text-coffee-900 mt-1">
              €{(products.reduce((s, p) => s + p.price, 0) / (products.length || 1)).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-coffee-100/60">
            <p className="text-xs text-coffee-500 uppercase tracking-wider">Categorías</p>
            <p className="text-2xl font-bold text-coffee-900 mt-1">
              {new Set(products.map((p) => p.category)).size}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
            />
          </div>
          <button
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-coffee-800 hover:bg-coffee-900 text-white text-sm font-medium rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Nuevo producto
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-coffee-100/60 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-coffee-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-coffee-600 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-coffee-600 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-coffee-600 uppercase tracking-wider">
                    Tueste
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-coffee-600 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-coffee-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-coffee-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-coffee-900 text-sm">{product.name}</p>
                          <p className="text-xs text-coffee-500">{product.origin}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-cream-100 text-coffee-700 text-xs rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-coffee-700">{product.roast}</td>
                    <td className="px-6 py-4 font-semibold text-coffee-900">
                      €{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          product.inStock
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.inStock ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {product.inStock ? "Disponible" : "Agotado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 hover:bg-coffee-100 rounded-lg transition-colors group"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4 text-coffee-500 group-hover:text-coffee-800" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-coffee-500 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-coffee-100">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-coffee-900 text-sm truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-coffee-500 mt-0.5">{product.origin}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-cream-100 text-coffee-700 text-[10px] rounded-full">
                        {product.category}
                      </span>
                      <span className="text-xs font-semibold text-coffee-900">
                        €{product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditForm(product)}
                      className="p-1.5 hover:bg-coffee-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-coffee-600" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 text-coffee-300 mx-auto mb-3" />
              <p className="text-coffee-600 font-medium">No hay productos</p>
              <p className="text-sm text-coffee-400 mt-1">
                Crea tu primer producto para empezar
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-coffee-950/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="sticky top-0 bg-white border-b border-coffee-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-lg font-bold text-coffee-900">
                {editingProduct ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-coffee-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-coffee-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Origen *
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Etiopía"
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Tueste *
                  </label>
                  <select
                    name="roast"
                    value={formData.roast}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  >
                    {ROASTS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Peso *
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    placeholder="250g"
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Altitud
                  </label>
                  <input
                    type="text"
                    name="altitude"
                    value={formData.altitude}
                    onChange={handleChange}
                    placeholder="1,800 - 2,000 m"
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Proceso
                  </label>
                  <input
                    type="text"
                    name="process"
                    value={formData.process}
                    onChange={handleChange}
                    placeholder="Lavado, Natural..."
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all resize-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Notas de cata (separadas por coma)
                  </label>
                  <input
                    type="text"
                    name="flavorNotes"
                    value={formData.flavorNotes}
                    onChange={handleChange}
                    placeholder="Jazmín, Bergamota, Miel"
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    URL de imagen
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                      />
                    </div>
                  </div>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 w-20 h-20 rounded-lg object-cover border border-coffee-200"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Valoración (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-coffee-300 text-coffee-700 focus:ring-warm-400"
                  />
                  <label className="text-sm font-medium text-coffee-700">
                    Disponible en stock
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-coffee-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-coffee-200 text-coffee-700 font-medium rounded-xl hover:bg-coffee-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-coffee-800 hover:bg-coffee-900 text-white font-semibold rounded-xl transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-coffee-950/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-coffee-900 text-center mb-2">
              ¿Eliminar producto?
            </h3>
            <p className="text-sm text-coffee-500 text-center mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-coffee-200 text-coffee-700 font-medium rounded-xl hover:bg-coffee-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
