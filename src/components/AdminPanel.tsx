import { useState, useRef, useMemo, useEffect } from "react";
import { useMenu } from "../context/MenuContext";
import { useCategories } from "../context/CategoryContext";
import { MenuItem } from "../data/menu";
import {
  Plus, Edit2, Trash2, LogOut, ArrowLeft, Package, Search, X, Save, Key, FolderKanban, Check,
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
  { value: "warm", class: "bg-warm-100 text-warm-700 border-warm-300" },
  { value: "olive", class: "bg-olive-100 text-olive-700 border-olive-300" },
  { value: "tomato", class: "bg-tomato-100 text-tomato-700 border-tomato-300" },
  { value: "cream", class: "bg-cream-100 text-cream-700 border-cream-300" },
  { value: "sky", class: "bg-sky-100 text-sky-700 border-sky-300" },
  { value: "violet", class: "bg-violet-100 text-violet-700 border-violet-300" },
  { value: "rose", class: "bg-rose-100 text-rose-700 border-rose-300" },
  { value: "amber", class: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "emerald", class: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "cyan", class: "bg-cyan-100 text-cyan-700 border-cyan-300" },
  { value: "fuchsia", class: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300" },
  { value: "lime", class: "bg-lime-100 text-lime-700 border-lime-300" },
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
  emoji: string;
  color: string;
  type?: string;
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
  emoji: "📁",
  color: "warm",
};

export default function AdminPanel({ onLogout, onBackToShop }: AdminPanelProps) {
  const { items, addItem, updateItem, deleteItem, loading: menuLoading, refreshItems } = useMenu();
  const { categories, addCategory, updateCategory, deleteCategory, refreshCategories, loading: categoriesLoading } = useCategories();
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ItemForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number } | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<CategoryForm>(emptyCategoryForm);
  const [viewMode, setViewMode] = useState<'list' | 'by-category'>('list');
  
  // Prevent body scroll when any modal/form is open in admin panel
  useEffect(() => {
    if (showForm || showChangePassword || editingCategory !== null) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showForm, showChangePassword, editingCategory]);

  // Mostrar loading mientras se cargan los datos
  if (menuLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-tomato-200 border-t-tomato-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-tomato-700 font-bold">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Agrupar productos por categoría para la vista optimizada
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    
    // Inicializar grupos para todas las categorías existentes
    categories.forEach(cat => {
      grouped[cat.type] = [];
    });
    
    // Asignar productos a sus categorías
    items.forEach(product => {
      if (grouped[product.type]) {
        grouped[product.type].push(product);
      } else {
        // Si el producto tiene una categoría que ya no existe (o es legacy), lo ponemos en "Otros"
        if (!grouped['otros']) grouped['otros'] = [];
        grouped['otros'].push(product);
      }
    });

    return grouped;
  }, [items, categories]);

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
    if (name === 'type') return; // No permitir cambios manuales al campo type
    setCategoryFormData({ ...categoryFormData, [name]: value });
  };

  const openCategoryForm = (category?: { id: number; name: string; description: string; type: string; emoji: string; color: string }) => {
    if (category) {
      setEditingCategory({ id: category.id });
      const autoType = category.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || category.type;
      setCategoryFormData({
        name: category.name,
        description: category.description,
        emoji: category.emoji,
        color: category.color,
        type: autoType,
      });
    } else {
      setEditingCategory({ id: -1 });
      setCategoryFormData({
        ...emptyCategoryForm,
        type: `cat_${Date.now()}`,
      });
    }
    setActiveTab('categories');
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generar el type automáticamente basado en el nombre al guardar
    const autoType = categoryFormData.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || `cat_${Date.now()}`;
    const categoryDataWithAutoType = { 
      name: categoryFormData.name,
      description: categoryFormData.description,
      emoji: categoryFormData.emoji,
      color: categoryFormData.color,
      type: autoType
    };
    
    console.log('Guardando categoría:', categoryDataWithAutoType, 'editingCategory:', editingCategory);
    try {
      if (editingCategory && editingCategory.id !== -1) {
        await updateCategory(editingCategory.id, categoryDataWithAutoType, refreshItems);
      } else {
        await addCategory(categoryDataWithAutoType);
      }
      setEditingCategory(null);
      setCategoryFormData(emptyCategoryForm);
      // Actualizar categorías sin recargar la página
      await refreshCategories();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
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
        {/* Pestañas de navegación */}
        <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-xl border border-tomato-100 w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-tomato-600 text-white shadow-md'
                : 'text-tomato-600 hover:bg-tomato-50'
            }`}
          >
            <Package className="w-4 h-4" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-tomato-600 text-white shadow-md'
                : 'text-tomato-600 hover:bg-tomato-50'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Categorías
          </button>
        </div>

        {/* Contenido de la pestaña Productos */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Stats - Solo total y disponibles en pestaña Productos */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-tomato-100/60">
                <p className="text-xs text-tomato-500 uppercase tracking-wider">Total productos</p>
                <p className="text-2xl font-black text-tomato-900 mt-1">{items.length}</p>
              </div>
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
                onClick={openCreateForm}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-tomato-600 hover:bg-tomato-700 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Nuevo producto
              </button>
            </div>

            {/* Toggle Vista */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-tomato-600 text-white shadow-md'
                    : 'bg-white text-tomato-600 hover:bg-tomato-50 border border-tomato-100'
                }`}
              >
                Lista Completa
              </button>
              <button
                onClick={() => setViewMode('by-category')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'by-category'
                    ? 'bg-tomato-600 text-white shadow-md'
                    : 'bg-white text-tomato-600 hover:bg-tomato-50 border border-tomato-100'
                }`}
              >
                Por Categoría
              </button>
            </div>

        {/* Vista por Categoría - Optimizada sin scroll */}
        {viewMode === 'by-category' && (
          <div className="space-y-8 mb-8 px-2 sm:px-4">
            {Object.entries(productsByCategory).map(([type, products]) => {
              const category = categories.find(c => c.type === type);
              const categoryName = category?.name || type;
              const categoryEmoji = category?.emoji || '📂';
              const categoryColorClass = category?.color === "warm" ? "from-warm-50 to-warm-100 border-warm-200" :
                                         category?.color === "olive" ? "from-olive-50 to-olive-100 border-olive-200" :
                                         category?.color === "tomato" ? "from-tomato-50 to-tomato-100 border-tomato-200" :
                                         category?.color === "cream" ? "from-cream-50 to-cream-100 border-cream-200" :
                                         category?.color === "sky" ? "from-sky-50 to-sky-100 border-sky-200" :
                                         category?.color === "violet" ? "from-violet-50 to-violet-100 border-violet-200" :
                                         category?.color === "rose" ? "from-rose-50 to-rose-100 border-rose-200" :
                                         category?.color === "amber" ? "from-amber-50 to-amber-100 border-amber-200" :
                                         category?.color === "emerald" ? "from-emerald-50 to-emerald-100 border-emerald-200" :
                                         category?.color === "cyan" ? "from-cyan-50 to-cyan-100 border-cyan-200" :
                                         category?.color === "fuchsia" ? "from-fuchsia-50 to-fuchsia-100 border-fuchsia-200" :
                                         category?.color === "lime" ? "from-lime-50 to-lime-100 border-lime-200" :
                                         "from-gray-50 to-gray-100 border-gray-200";
              const headerColorClass = category?.color === "warm" ? "bg-warm-500" :
                                       category?.color === "olive" ? "bg-olive-500" :
                                       category?.color === "tomato" ? "bg-tomato-500" :
                                       category?.color === "cream" ? "bg-cream-500" :
                                       category?.color === "sky" ? "bg-sky-500" :
                                       category?.color === "violet" ? "bg-violet-500" :
                                       category?.color === "rose" ? "bg-rose-500" :
                                       category?.color === "amber" ? "bg-amber-500" :
                                       category?.color === "emerald" ? "bg-emerald-500" :
                                       category?.color === "cyan" ? "bg-cyan-500" :
                                       category?.color === "fuchsia" ? "bg-fuchsia-500" :
                                       category?.color === "lime" ? "bg-lime-500" :
                                       "bg-gray-500";

              if (products.length === 0) return null;

              // Calcular columnas dinámicas según cantidad de productos - optimizado para mostrar todos sin scroll
              const gridCols = products.length === 1 ? 'grid-cols-1' : 
                               products.length === 2 ? 'grid-cols-2' : 
                               products.length <= 4 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 
                               'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';

              return (
                <div key={type} className="bg-white rounded-2xl border border-tomato-100/60 overflow-hidden shadow-sm">
                  <div className={`${headerColorClass} px-4 sm:px-6 py-3 sm:py-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">{categoryEmoji}</span>
                        <h3 className="font-black text-white text-base sm:text-lg">{categoryName}</h3>
                      </div>
                      <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-white text-xs font-bold">
                        {products.length} {products.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    {/* Grid de tarjetas en lugar de tabla para mejor visualización - todos visibles sin scroll */}
                    <div className={`grid ${gridCols} gap-2 sm:gap-3`}>
                      {products.map((item) => (
                        <div key={item.id} className="bg-cream-50 rounded-xl p-3 border border-tomato-100/50 hover:border-tomato-200 transition-all">
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cream-100 to-warm-100 flex items-center justify-center">
                              <span className="text-2xl">{item.emoji}</span>
                            </div>
                            <div className="w-full">
                              <p className="font-bold text-tomato-900 text-xs line-clamp-1">{item.name}</p>
                              <p className="font-black text-tomato-700 text-sm">${item.price}</p>
                              <div className="flex items-center justify-center gap-1 mt-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                  item.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.inStock ? "bg-green-500" : "bg-red-500"}`} />
                                  {item.inStock ? 'Disp.' : 'Agot.'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 w-full mt-2 pt-2 border-t border-tomato-100/50">
                              <button onClick={() => openEditForm(item)} className="flex-1 p-1.5 hover:bg-tomato-50 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4 text-tomato-500 mx-auto" />
                              </button>
                              <button onClick={() => setDeleteConfirm(item.id)} className="flex-1 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4 text-red-500 mx-auto" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table - Solo mostrar en vista Lista Completa */}
        {viewMode === 'list' && (
          <div>
            <div className="bg-white rounded-2xl border border-tomato-100/60 overflow-hidden relative">
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

          {/* Vista Mobile - Cards */}
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
      )}
      {/* Fin pestaña Productos */}

      {/* Formulario de producto (crear/editar) - FUERA de las pestañas */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tomato-950/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-tomato-900">{editingItem ? "Editar producto" : "Nuevo producto"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-tomato-50 rounded-lg transition-colors">
                <X className="w-5 h-5 text-tomato-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Nombre del producto *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    placeholder="Ej: Pollo asado entero"
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
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all"
                  />
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
                  <div className="border border-tomato-100 rounded-xl p-3 bg-cream-50 overflow-y-auto" style={{ maxHeight: '180px' }}>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {EMOJIS.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setFormData({ ...formData, emoji: e })}
                          className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all flex-shrink-0 ${
                            formData.emoji === e
                              ? "bg-tomato-100 ring-2 ring-tomato-500 scale-110 z-20 relative"
                              : "bg-white hover:bg-cream-100"
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
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

      {/* Category Form Modal */}
      {activeTab === 'categories' && editingCategory !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tomato-950/60 backdrop-blur-sm" onClick={() => setEditingCategory(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="sticky top-0 bg-white border-b border-tomato-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-lg font-black text-tomato-900">
                {editingCategory ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button onClick={() => setEditingCategory(null)} className="p-2 hover:bg-tomato-50 rounded-full">
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
                <label className="block text-sm font-bold text-tomato-800 mb-1.5">Emoji</label>
                <div className="border border-tomato-100 rounded-xl p-3 bg-cream-50 overflow-y-auto" style={{ maxHeight: '180px' }}>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setCategoryFormData({ ...categoryFormData, emoji: e })}
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all flex-shrink-0 ${
                          categoryFormData.emoji === e
                            ? "bg-tomato-100 ring-2 ring-tomato-500 scale-110 z-20 relative"
                            : "bg-white hover:bg-cream-100"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-tomato-800 mb-1.5">Color</label>
                <div className="border border-tomato-100 rounded-xl p-3 bg-cream-50 overflow-y-auto" style={{ maxHeight: '120px' }}>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {CATEGORY_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategoryFormData({ ...categoryFormData, color: c.value })}
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 transition-all ${
                          categoryFormData.color === c.value
                            ? c.class + " ring-2 ring-tomato-500 scale-110 z-20 relative"
                            : c.class + " hover:scale-105"
                        }`}
                        title={c.value}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-tomato-100">
                <button type="button" onClick={() => setEditingCategory(null)}
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

      {/* Contenido de la pestaña Categorías - Lista principal */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Stats - Solo en pestaña Categorías */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 px-2 sm:px-0">
            {categories.map((cat) => {
              const count = categoryCounts[cat.type] || 0;
              return (
                <div key={cat.id} className="bg-white rounded-xl p-4 border border-tomato-100/60">
                  <p className="text-xs text-tomato-500 uppercase tracking-wider">{cat.name}</p>
                  <p className={`text-2xl font-black mt-1 ${
                    cat.color === "warm" ? "text-warm-700" :
                    cat.color === "olive" ? "text-olive-700" :
                    cat.color === "tomato" ? "text-tomato-700" :
                    cat.color === "cream" ? "text-cream-700" :
                    cat.color === "sky" ? "text-sky-700" :
                    cat.color === "violet" ? "text-violet-700" :
                    cat.color === "rose" ? "text-rose-700" :
                    cat.color === "amber" ? "text-amber-700" :
                    cat.color === "emerald" ? "text-emerald-700" :
                    cat.color === "cyan" ? "text-cyan-700" :
                    cat.color === "fuchsia" ? "text-fuchsia-700" :
                    cat.color === "lime" ? "text-lime-700" :
                    "text-gray-700"
                  }`}>
                    {count} {count === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              );
            })}
            {categories.length === 0 && (
              <div className="col-span-full bg-white rounded-xl p-4 border border-tomato-100/60">
                <p className="text-xs text-tomato-500 uppercase tracking-wider">Sin categorías</p>
                <p className="text-2xl font-black mt-1 text-tomato-700">0</p>
              </div>
            )}
          </div>

          {/* Toolbar categorías */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 px-2 sm:px-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tomato-400" />
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-tomato-100 rounded-xl text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
              />
            </div>
            <button
              onClick={() => openCategoryForm()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-warm-600 hover:bg-warm-700 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Nueva categoría
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-0">
            {categories
              .filter(cat => 
                searchQuery === "" || 
                cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cat.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((cat) => {
                const count = categoryCounts[cat.type] || 0;
                return (
                  <div key={cat.id} className="bg-white rounded-xl p-5 border border-tomato-100/60 hover:border-tomato-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          cat.color === "warm" ? "bg-warm-100" :
                          cat.color === "olive" ? "bg-olive-100" :
                          cat.color === "tomato" ? "bg-tomato-100" :
                          cat.color === "cream" ? "bg-cream-100" :
                          cat.color === "sky" ? "bg-sky-100" :
                          cat.color === "violet" ? "bg-violet-100" :
                          cat.color === "rose" ? "bg-rose-100" :
                          cat.color === "amber" ? "bg-amber-100" :
                          cat.color === "emerald" ? "bg-emerald-100" :
                          cat.color === "cyan" ? "bg-cyan-100" :
                          cat.color === "fuchsia" ? "bg-fuchsia-100" :
                          cat.color === "lime" ? "bg-lime-100" :
                          "bg-gray-100"
                        }`}>
                          <span className="text-2xl">{cat.emoji}</span>
                        </div>
                        <div>
                          <h4 className="font-black text-tomato-900 text-base">{cat.name}</h4>
                          <p className="text-xs text-tomato-500 font-semibold">{count} {count === 1 ? 'producto' : 'productos'}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openCategoryForm(cat)} className="p-2 hover:bg-tomato-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-tomato-600" />
                        </button>
                        <button 
                          onClick={() => { if (confirm('¿Eliminar esta categoría?')) handleDeleteCategory(cat.id); }} 
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={count > 0}
                          title={count > 0 ? 'Hay productos en esta categoría' : 'Eliminar categoría'}
                        >
                          <Trash2 className={`w-4 h-4 ${count > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-500'}`} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-tomato-600 line-clamp-2">{cat.description}</p>
                  </div>
                );
              })}
          </div>

          {categories.length === 0 && (
            <div className="p-12 text-center">
              <FolderKanban className="w-10 h-10 text-tomato-300 mx-auto mb-3" />
              <p className="text-tomato-700 font-bold mb-2">No hay categorías</p>
              <p className="text-sm text-tomato-500 mb-4">Crea tu primera categoría para organizar los productos</p>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryFormData({
                    ...emptyCategoryForm,
                    type: `cat_${Date.now()}`,
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-warm-600 hover:bg-warm-700 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Crear primera categoría
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  </div>
);
}
