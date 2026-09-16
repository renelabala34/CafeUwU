import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { initialMenu, MenuItem } from "../data/menu";

interface MenuContextType {
  items: MenuItem[];
  loading: boolean;
  addItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  updateItem: (id: number, item: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  refreshItems: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem("imas_menu");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialMenu;
      }
    }
    return initialMenu;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("imas_menu", JSON.stringify(items));
  }, [items]);

  const addItem = async (item: Omit<MenuItem, "id">) => {
    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    setItems((prev) => [...prev, { ...item, id: newId }]);
  };

  const updateItem = async (id: number, updates: Partial<MenuItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const deleteItem = async (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const refreshItems = async () => {
    const stored = localStorage.getItem("imas_menu");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems(initialMenu);
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
