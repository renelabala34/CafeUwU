import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { products as initialProducts, Product } from "../data/products";
import { supabase } from "../lib/supabase";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Helper para mapear la fila de Supabase al tipo Product
function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    origin: row.origin,
    category: row.category,
    roast: row.roast,
    price: row.price,
    weight: row.weight,
    description: row.description || "",
    flavorNotes: row.flavor_notes || [],
    altitude: row.altitude || "",
    process: row.process || "",
    image: row.image || "",
    rating: row.rating,
    inStock: row.in_stock,
  };
}

// Helper para mapear Product a formato de Supabase
function mapProductToRow(product: Partial<Product>) {
  return {
    name: product.name,
    origin: product.origin,
    category: product.category,
    roast: product.roast,
    price: product.price,
    weight: product.weight,
    description: product.description,
    flavor_notes: product.flavorNotes,
    altitude: product.altitude,
    process: product.process,
    image: product.image,
    rating: product.rating,
    in_stock: product.inStock,
  };
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSupabase, setUseSupabase] = useState(true);

  // Cargar productos desde Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        setProducts(data.map(mapRowToProduct));
        setUseSupabase(true);
      } else {
        // Si no hay datos en Supabase, usar datos locales
        setProducts(initialProducts);
        setUseSupabase(false);
      }
    } catch (err: any) {
      console.warn("Supabase no disponible, usando datos locales:", err.message);
      setProducts(initialProducts);
      setUseSupabase(false);
      setError(null); // No mostrar error, fallback silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    if (useSupabase) {
      try {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(mapProductToRow(product))
          .select()
          .single();

        if (insertError) throw insertError;
        setProducts((prev) => [...prev, mapRowToProduct(data)]);
      } catch (err: any) {
        console.error("Error al agregar producto:", err);
        // Fallback local
        const newId = Math.max(...products.map((p) => p.id), 0) + 1;
        setProducts((prev) => [...prev, { ...product, id: newId }]);
      }
    } else {
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      setProducts((prev) => [...prev, { ...product, id: newId }]);
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    if (useSupabase) {
      try {
        const { error: updateError } = await supabase
          .from("products")
          .update({ ...mapProductToRow(updates), updated_at: new Date().toISOString() })
          .eq("id", id);

        if (updateError) throw updateError;
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
      } catch (err: any) {
        console.error("Error al actualizar producto:", err);
        // Fallback local
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
      }
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    }
  };

  const deleteProduct = async (id: number) => {
    if (useSupabase) {
      try {
        const { error: deleteError } = await supabase
          .from("products")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err: any) {
        console.error("Error al eliminar producto:", err);
        // Fallback local
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
