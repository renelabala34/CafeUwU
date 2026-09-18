import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";

export interface Category {
  id: number;
  name: string;
  description: string;
  type: string;
  emoji: string;
  color: string;
  createdAt?: string;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const categoryToDb = (category: Partial<Category>) => ({
  name: category.name,
  description: category.description,
  type: category.type,
  emoji: category.emoji,
  color: category.color,
  created_at: category.createdAt,
});

const dbToCategory = (row: any): Category => ({
  id: row.id,
  name: row.name,
  description: row.description,
  type: row.type,
  emoji: row.emoji,
  color: row.color,
  createdAt: row.created_at,
});

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('id', { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            setCategories(data.map(dbToCategory));
          } else {
            // Categorías por defecto si no hay datos
            setCategories([
              { id: 1, name: "Ofertas sin freír", description: "Productos crudos/preparados para freír en casa", type: "sin_freir", emoji: "🍗", color: "warm" },
              { id: 2, name: "Especial I'MAS — Preparados", description: "Listos para comer", type: "preparado", emoji: "🌮", color: "olive" },
            ]);
          }
        } catch (error) {
          console.error('Error loading categories from Supabase:', error);
          // Fallback a localStorage
          const stored = localStorage.getItem("imas_categories");
          if (stored) {
            try {
              setCategories(JSON.parse(stored));
            } catch {
              setCategories([
                { id: 1, name: "Ofertas sin freír", description: "Productos crudos/preparados para freír en casa", type: "sin_freir", emoji: "🍗", color: "warm" },
                { id: 2, name: "Especial I'MAS — Preparados", description: "Listos para comer", type: "preparado", emoji: "🌮", color: "olive" },
              ]);
            }
          } else {
            setCategories([
              { id: 1, name: "Ofertas sin freír", description: "Productos crudos/preparados para freír en casa", type: "sin_freir", emoji: "🍗", color: "warm" },
              { id: 2, name: "Especial I'MAS — Preparados", description: "Listos para comer", type: "preparado", emoji: "🌮", color: "olive" },
            ]);
          }
        }
      } else {
        const stored = localStorage.getItem("imas_categories");
        if (stored) {
          try {
            setCategories(JSON.parse(stored));
          } catch {
            setCategories([
              { id: 1, name: "Ofertas sin freír", description: "Productos crudos/preparados para freír en casa", type: "sin_freir", emoji: "🍗", color: "warm" },
              { id: 2, name: "Especial I'MAS — Preparados", description: "Listos para comer", type: "preparado", emoji: "🌮", color: "olive" },
            ]);
          }
        } else {
          setCategories([
            { id: 1, name: "Ofertas sin freír", description: "Productos crudos/preparados para freír en casa", type: "sin_freir", emoji: "🍗", color: "warm" },
            { id: 2, name: "Especial I'MAS — Preparados", description: "Listos para comer", type: "preparado", emoji: "🌮", color: "olive" },
          ]);
        }
      }
      setLoading(false);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!supabase) {
      localStorage.setItem("imas_categories", JSON.stringify(categories));
    }
  }, [categories]);

  const addCategory = async (category: Omit<Category, "id">) => {
    const now = new Date().toISOString();
    const categoryWithTimestamp = { ...category, createdAt: now };
    
    if (supabase) {
      try {
        // Verificar si ya existe una categoría con ese nombre o type
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .or(`name.eq.${category.name},type.eq.${category.type}`)
          .maybeSingle();

        if (existing) {
          alert('Ya existe una categoría con ese nombre o tipo.');
          return;
        }

        const { data, error } = await supabase
          .from('categories')
          .insert([categoryToDb(categoryWithTimestamp)])
          .select()
          .single();

        if (error) throw error;
        setCategories((prev) => [...prev, dbToCategory(data)]);
      } catch (error: any) {
        console.error('Error adding category:', error);
        // Si el error es porque la tabla no existe, usar fallback local
        if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
          const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
          setCategories((prev) => [...prev, { ...categoryWithTimestamp, id: newId }]);
          alert('La tabla categories no existe en Supabase. La categoría se guardó localmente.');
        } else {
          const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
          setCategories((prev) => [...prev, { ...categoryWithTimestamp, id: newId }]);
        }
      }
    } else {
      const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
      setCategories((prev) => [...prev, { ...categoryWithTimestamp, id: newId }]);
    }
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('categories')
          .update(categoryToDb(updates))
          .eq('id', id);

        if (error) throw error;
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      } catch (error: any) {
        console.error('Error updating category:', error);
        // Si el error es porque la tabla no existe, usar fallback local
        if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
          setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
        } else {
          setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
        }
      }
    } else {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    }
  };

  const deleteCategory = async (id: number) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } catch (error: any) {
        console.error('Error deleting category:', error);
        // Si el error es porque la tabla no existe, usar fallback local
        if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
          setCategories((prev) => prev.filter((c) => c.id !== id));
        } else {
          setCategories((prev) => prev.filter((c) => c.id !== id));
        }
      }
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const refreshCategories = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) {
          setCategories(data.map(dbToCategory));
        }
      } catch (error: any) {
        console.error('Error refreshing categories:', error);
        // Si la tabla no existe, mantener las categorías en memoria
        if (!error?.message?.includes('relation') && !error?.message?.includes('does not exist')) {
          // Otros errores, intentar cargar de localStorage
          const stored = localStorage.getItem("imas_categories");
          if (stored) {
            try {
              setCategories(JSON.parse(stored));
            } catch {}
          }
        }
      }
    } else {
      const stored = localStorage.getItem("imas_categories");
      if (stored) {
        try {
          setCategories(JSON.parse(stored));
        } catch {
          setCategories([
            { id: 1, name: "Ofertas sin freír", description: "Productos crudos/preparados para freír en casa", type: "sin_freir", emoji: "🍗", color: "warm" },
            { id: 2, name: "Especial I'MAS — Preparados", description: "Listos para comer", type: "preparado", emoji: "🌮", color: "olive" },
          ]);
        }
      }
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, addCategory, updateCategory, deleteCategory, refreshCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
