import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { initialMenu, MenuItem } from "../data/menu";
import { supabase } from "../lib/supabase";

interface MenuContextType {
  items: MenuItem[];
  loading: boolean;
  addItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  updateItem: (id: number, item: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  refreshItems: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Función para convertir de formato DB a formato app
const dbToMenuItem = (row: any): MenuItem => ({
  id: row.id,
  name: row.name,
  section: row.section,
  price: row.price,
  quantity: row.quantity,
  type: row.type,
  description: row.description,
  emoji: row.emoji,
  inStock: row.in_stock,
  createdAt: row.created_at,
});

// Función para convertir de formato app a formato DB
const menuItemToDb = (item: Partial<MenuItem>) => ({
  name: item.name,
  section: item.section,
  price: item.price,
  quantity: item.quantity,
  type: item.type,
  description: item.description,
  emoji: item.emoji,
  in_stock: item.inStock,
  created_at: item.createdAt,
});

export function MenuProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar items desde Supabase o localStorage
  useEffect(() => {
    const loadItems = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('id', { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            setItems(data.map(dbToMenuItem));
          } else {
            // Si no hay datos en Supabase, usar datos iniciales
            setItems(initialMenu);
          }
        } catch (error) {
          console.error('Error loading from Supabase:', error);
          // Fallback a localStorage
          const stored = localStorage.getItem("imas_menu");
          if (stored) {
            try {
              setItems(JSON.parse(stored));
            } catch {
              setItems(initialMenu);
            }
          } else {
            setItems(initialMenu);
          }
        }
      } else {
        // Sin Supabase, usar localStorage
        const stored = localStorage.getItem("imas_menu");
        if (stored) {
          try {
            setItems(JSON.parse(stored));
          } catch {
            setItems(initialMenu);
          }
        } else {
          setItems(initialMenu);
        }
      }
      setLoading(false);
    };

    loadItems();
  }, []);

  // Sincronizar con localStorage cuando cambien los items
  useEffect(() => {
    if (!supabase) {
      localStorage.setItem("imas_menu", JSON.stringify(items));
    }
  }, [items]);

  const addItem = async (item: Omit<MenuItem, "id">) => {
    const now = new Date().toISOString();
    const itemWithTimestamp = { ...item, createdAt: now };
    
    if (supabase) {
      try {
        // Primero verificar si ya existe un producto con el mismo nombre, sección y tipo
        const { data: existing } = await supabase
          .from('menu_items')
          .select('id')
          .eq('name', item.name)
          .eq('section', item.section)
          .eq('type', item.type)
          .maybeSingle();

        if (existing) {
          alert('Ya existe un producto con el mismo nombre, sección y tipo.');
          return;
        }

        const { data, error } = await supabase
          .from('menu_items')
          .insert([menuItemToDb(itemWithTimestamp)])
          .select()
          .single();

        if (error) throw error;
        setItems((prev) => [...prev, dbToMenuItem(data)]);
      } catch (error) {
        console.error('Error adding item:', error);
        // Fallback local
        const newId = Math.max(...items.map((i) => i.id), 0) + 1;
        setItems((prev) => [...prev, { ...itemWithTimestamp, id: newId }]);
      }
    } else {
      const newId = Math.max(...items.map((i) => i.id), 0) + 1;
      setItems((prev) => [...prev, { ...itemWithTimestamp, id: newId }]);
    }
  };

  const updateItem = async (id: number, updates: Partial<MenuItem>) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .update(menuItemToDb(updates))
          .eq('id', id);

        if (error) throw error;
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
      } catch (error) {
        console.error('Error updating item:', error);
        // Fallback local
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
      }
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    }
  };

  const deleteItem = async (id: number) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setItems((prev) => prev.filter((i) => i.id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
        // Fallback local
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const refreshItems = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) {
          setItems(data.map(dbToMenuItem));
        }
      } catch (error) {
        console.error('Error refreshing items:', error);
      }
    } else {
      const stored = localStorage.getItem("imas_menu");
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          setItems(initialMenu);
        }
      }
    }
  };

  return (
    <MenuContext.Provider value={{ items, loading, addItem, updateItem, deleteItem, refreshItems }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
