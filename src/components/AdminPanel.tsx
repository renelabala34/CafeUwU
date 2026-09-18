import { useState, useRef } from "react";
import { useMenu } from "../context/MenuContext";
import { useCategories } from "../context/CategoryContext";
import { MenuItem } from "../data/menu";
import {
  Plus, Edit2, Trash2, LogOut, ArrowLeft, Package, Search, X, Save, Key, FolderKanban,
} from "lucide-react";
import ChangePassword from "./ChangePassword";

interface AdminPanelProps {
  onLogout: () => void;
  onBackToShop: () => void;
}

const EMOJIS = [
  "🍗", "🐟", "🌭", "🧀", "🥓", "🥔", "🌽", "🍌", "🍖", "🥩", "🍕", "🌮",
  "🍤", "🥘", "🍲", "🥙", "🍛", "🍝", "🥐", "🥖", "🫓", "🧈", "🥚",
  "🥗", "🫘", "🍚", "🥄", "🍴", "🥢", "🧂", "🌶️", "🧄", "🧅",
  "🍔", "🍟", "🌯", "🥪", "🍜", "🍣", "🍱", "🍙", "🍘", "🍥",
  "🥟", "🥠", "🥡", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰",
  "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🥛", "☕", "🍵",
  "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹",
  "🥥", "🥝", "🍋", "🍈", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑",
  "🥭", "🍍", "🥥", "🥑", "🍆", "🥕", "🌽", "🌶️", "🥒", "🥬",
  "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🥨",
  "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟"
];

const CATEGORY_COLORS = [
  { value: "warm", label: "Cálido", class: "bg-warm-100 text-warm-700" },
  { value: "olive", label: "Oliva", class: "bg-olive-100 text-olive-700" },
  { value: "tomato", label: "Tomate", class: "bg-tomato-100 text-tomato-700" },
  { value: "cream", label: "Crema", class: "bg-cream-100 text-cream-700" },
];

interface ItemForm {
  name: string;
  section: string;
  price: string;
  quantity: string;
  type: string;
  description: string;
  emoji: string;
  inStock: boolean;
}

interface CategoryForm {
  name: string;
  description: string;
  type: string;
  emoji: string;
  color: string;
}

const emptyForm: ItemForm = {
  name: "",
  section: "sin_freir",
  price: "",
  quantity: "1",
  type: "sin_freir",
  description: "",
  emoji: "🍗",
  inStock: true,
};

const emptyCategoryForm: CategoryForm = {
  name: "",
  description: "",
  type: "sin_freir",
  emoji: "📁",
  color: "warm",
};

export default function AdminPanel({ onLogout, onBackToShop }: AdminPanelProps) {
  const { items, addItem, updateItem, deleteItem } = useMenu();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ItemForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number } | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<CategoryForm>(emptyCategoryForm);

  const filtered = items.filter(
    (i) =>
      searchQuery === "" ||
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      section: item.section,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      type: item.type,
      description: item.description,
      emoji: item.emoji,
      inStock: item.inStock,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      section: formData.section,
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity) || 1,
      type: formData.type,
      description: formData.description,
      emoji: formData.emoji,
      inStock: formData.inStock,
    };
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await addItem(data);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id);
    setDeleteConfirm(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      // When section changes, also update type to match
      if (name === "section") {
        setFormData({ 
          ...formData, 
          section: value,
          type: value
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCategoryFormData({ ...categoryFormData, [name]: value });
  };

  const openCategoryForm = (category?: { id: number; name: string; description: string; type: string; emoji: string; color: string }) => {
    if (category) {
      setEditingCategory({ id: category.id });
      setCategoryFormData({
        name: category.name,
        description: category.description,
        type: category.type,
        emoji: category.emoji,
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData(emptyCategoryForm);
    }
    setShowCategories(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryFormData);
    } else {
      await addCategory(categoryFormData);
    }
    setShowCategories(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: number) => {
    await deleteCategory(id);
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  };
  
  const categoryCounts = getCategoryCounts();
  
  // Helper para obtener el color de una categoría por su type
  const getCategoryColor = (type: string) => {
    const cat = categories.find(c => c.type === type);
    if (!cat) return "warm";
    return cat.color;
  };
  
  // Helper para obtener el nombre de una categoría por su type
  const getCategoryName = (type: string) => {
    const cat = categories.find(c => c.type === type);
    return cat ? cat.name : type;
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-30 bg-white border-b border-tomato-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={onBackToShop} className="p-2 hover:bg-tomato-50 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-tomato-700" />
              </button>
              <div>
                <h1 className="text-lg font-black text-tomato-900">Panel Admin</h1>
                <p className="text-xs text-tomato-500">Gestión del menú</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-tomato-600 hover:text-tomato-800 hover:bg-tomato-50 rounded-full transition-all"
                title="Cambiar contraseña"
              >
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Contraseña</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-tomato-600 hover:text-tomato-800 hover:bg-tomato-50 rounded-full transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-tomato-100/60">
            <p className="text-xs text-tomato-500 uppercase tracking-wider">Total productos</p>
            <p className="text-2xl font-black text-tomato-900 mt-1">{items.length}</p>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl p-4 border border-tomato-100/60">
              <p className="text-xs text-tomato-500 uppercase tracking-wider">{cat.name}</p>
              <p className={`text-2xl font-black mt-1 ${
                cat.color === "warm" ? "text-warm-700" :
                cat.color === "olive" ? "text-olive-700" :
                cat.color === "tomato" ? "text-tomato-700" :
                "text-cream-700"
              }`}>
                {categoryCounts[cat.type] || 0}
              </p>
            </div>
          ))}
          <div className="bg-white rounded-xl p-4 border border-tomato-100/60">
            <p className="text-xs text-tomato-500 uppercase tracking-wider">Disponibles</p>
            <p className="text-2xl font-black text-tomato-900 mt-1">
              {items.filter((i) => i.inStock).length}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tomato-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-tomato-100 rounded-xl text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
            />
          </div>
          <button
            onClick={() => openCategoryForm()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-warm-600 hover:bg-warm-700 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <FolderKanban className="w-4 h-4" />
            Gestionar categorías
          </button>
          <button
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-tomato-600 hover:bg-tomato-700 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Nuevo producto
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-tomato-100/60 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-tomato-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-tomato-600 uppercase tracking-wider">Producto</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-tomato-600 uppercase tracking-wider">Sección</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-tomato-600 uppercase tracking-wider">Precio</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-tomato-600 uppercase tracking-wider">Stock</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-tomato-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tomato-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cream-100 to-warm-100 flex items-center justify-center shrink-0">
                          <span className="text-2xl">{item.emoji}</span>
                        </div>
                        <div>
                          <p className="font-bold text-tomato-900 text-sm">{item.name}</p>
                          <p className="text-xs text-tomato-500">{item.quantity} unidades</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        getCategoryColor(item.type) === "warm"
                          ? "bg-warm-100 text-warm-700"
                          : getCategoryColor(item.type) === "olive"
                          ? "bg-olive-100 text-olive-700"
                          : getCategoryColor(item.type) === "tomato"
                          ? "bg-tomato-100 text-tomato-700"
                          : "bg-cream-100 text-cream-700"
                      }`}>
                        {getCategoryName(item.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-tomato-900">${item.price} CUP</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        item.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.inStock ? "bg-green-500" : "bg-red-500"}`} />
                        {item.inStock ? "Disponible" : "Agotado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEditForm(item)} className="p-2 hover:bg-tomato-50 rounded-lg transition-colors group" title="Editar">
                          <Edit2 className="w-4 h-4 text-tomato-500 group-hover:text-tomato-800" />
                        </button>
                        <button onClick={() => setDeleteConfirm(item.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Eliminar">
                          <Trash2 className="w-4 h-4 text-tomato-500 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-tomato-100">
            {filtered.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cream-100 to-warm-100 flex items-center justify-center shrink-0">
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-tomato-900 text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-tomato-500 mt-0.5">{item.quantity} unidades</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        getCategoryColor(item.type) === "warm" ? "bg-warm-100 text-warm-700" : getCategoryColor(item.type) === "olive" ? "bg-olive-100 text-olive-700" : getCategoryColor(item.type) === "tomato" ? "bg-tomato-100 text-tomato-700" : "bg-cream-100 text-cream-700"
                      }`}>
                        {getCategoryName(item.type)}
                      </span>
                      <span className="text-xs font-black text-tomato-900">${item.price} CUP</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => openEditForm(item)} className="p-1.5 hover:bg-tomato-50 rounded-lg">
                      <Edit2 className="w-4 h-4 text-tomato-600" />
                    </button>
                    <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 text-tomato-300 mx-auto mb-3" />
              <p className="text-tomato-700 font-bold">No hay productos</p>
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tomato-950/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="sticky top-0 bg-white border-b border-tomato-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-lg font-black text-tomato-900">
                {editingItem ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-tomato-50 rounded-full">
                <X className="w-5 h-5 text-tomato-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Nombre *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Sección *</label>
                  <select name="section" value={formData.section} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all">
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.type}>{cat.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-tomato-500 mt-1">La sección determina la categoría del producto</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Precio (CUP) *</label>
                  <input type="number" min="0" name="price" value={formData.price} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Cantidad por paquete *</label>
                  <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} required
                    placeholder="Ej: 10"
                    className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Descripción *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={2}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Emoji (opcional)</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setFormData({ ...formData, emoji: e })}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                          formData.emoji === e
                            ? "bg-tomato-100 ring-2 ring-tomato-500 scale-110"
                            : "bg-cream-50 hover:bg-cream-100"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange}
                    className="w-4 h-4 rounded border-tomato-300 text-tomato-700 focus:ring-warm-400" />
                  <label className="text-sm font-bold text-tomato-800">Disponible</label>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-tomato-100">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-tomato-200 text-tomato-700 font-bold rounded-xl hover:bg-tomato-50 transition-all">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-tomato-600 hover:bg-tomato-700 text-white font-bold rounded-xl transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingItem ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tomato-950/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-black text-tomato-900 text-center mb-2">¿Eliminar producto?</h3>
            <p className="text-sm text-tomato-500 text-center mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-tomato-200 text-tomato-700 font-bold rounded-xl hover:bg-tomato-50 transition-all">
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}

      {/* Categories Management Modal */}
      {showCategories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tomato-950/60 backdrop-blur-sm" onClick={() => setShowCategories(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="sticky top-0 bg-white border-b border-tomato-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-lg font-black text-tomato-900">
                {editingCategory ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button onClick={() => setShowCategories(false)} className="p-2 hover:bg-tomato-50 rounded-full">
                <X className="w-5 h-5 text-tomato-600" />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-tomato-800 mb-1.5">Nombre *</label>
                <input type="text" name="name" value={categoryFormData.name} onChange={handleCategoryChange} required
                  className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-tomato-800 mb-1.5">Descripción *</label>
                <textarea name="description" value={categoryFormData.description} onChange={handleCategoryChange} required rows={2}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-tomato-800 mb-1.5">Tipo *</label>
                <input 
                  type="text" 
                  name="type" 
                  value={categoryFormData.type} 
                  onChange={handleCategoryChange} 
                  required
                  placeholder="Ej: sin_freir, preparado, postres, bebidas..."
                  className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all" 
                />
                <p className="text-xs text-tomato-500 mt-1">El tipo se usará como identificador interno (sin espacios ni caracteres especiales)</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-tomato-800 mb-1.5">Emoji</label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-cream-50 rounded-xl border border-tomato-100">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setCategoryFormData({ ...categoryFormData, emoji: e })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        categoryFormData.emoji === e
                          ? "bg-tomato-100 ring-2 ring-tomato-500 scale-110"
                          : "bg-white hover:bg-cream-100"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-tomato-800 mb-1.5">Color</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategoryFormData({ ...categoryFormData, color: c.value })}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        categoryFormData.color === c.value
                          ? c.class + " ring-2 ring-tomato-500"
                          : "bg-cream-50 text-tomato-600 hover:bg-cream-100"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-tomato-100">
                <button type="button" onClick={() => setShowCategories(false)}
                  className="flex-1 py-3 border border-tomato-200 text-tomato-700 font-bold rounded-xl hover:bg-tomato-50 transition-all">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-tomato-600 hover:bg-tomato-700 text-white font-bold rounded-xl transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingCategory ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List Modal - Show existing categories */}
      {!showCategories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ display: 'none' }} />
      )}

      {/* Category List in Main Panel */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FolderKanban className="w-4 h-4 text-tomato-500" />
          <span className="text-sm font-bold text-tomato-800">Categorías ({categories.length})</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl p-4 border border-tomato-100/60 hover:border-tomato-200 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cream-100 to-warm-100 flex items-center justify-center">
                    <span className="text-xl">{cat.emoji}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-tomato-900 text-sm">{cat.name}</h4>
                    <p className="text-xs text-tomato-500">{cat.type}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openCategoryForm(cat)} className="p-1.5 hover:bg-tomato-50 rounded-lg">
                    <Edit2 className="w-4 h-4 text-tomato-600" />
                  </button>
                  <button onClick={() => { if (confirm('¿Eliminar esta categoría?')) handleDeleteCategory(cat.id); }} className="p-1.5 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-tomato-600 mt-2 line-clamp-2">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
