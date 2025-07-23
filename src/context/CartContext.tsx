import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Interfaces (Pastikan ini sama dengan yang Anda gunakan di komponen lain)
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  thumbnailUrl?: string;
  resourceUrl?: string;
  categoryId: string;
  category: { id: string; name: string };
  tags: { id: string; name: string; color?: string }[];
  rating?: number;
  downloads?: number;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

// Data mock produk (Bisa diimpor dari file lain jika Anda punya)
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Design System Template Pro",
    description:
      "Complete design system with 200+ components, design tokens, and comprehensive guidelines for modern web applications.",
    price: 299000,
    slug: "design-system-template-pro",
    thumbnailUrl:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    categoryId: "1",
    category: { id: "1", name: "Design Templates" },
    tags: [
      { id: "1", name: "UI/UX", color: "#3B82F6" },
      { id: "2", name: "Figma", color: "#10B981" },
      { id: "3", name: "Premium", color: "#F59E0B" },
    ],
    rating: 4.8,
    downloads: 1250,
  },
  {
    id: "2",
    title: "Brand Identity Package",
    description:
      "Complete branding solution including logo variations, color palettes, typography guidelines, and brand applications.",
    price: 450000,
    slug: "brand-identity-package",
    thumbnailUrl:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    categoryId: "2",
    category: { id: "2", name: "Branding" },
    tags: [
      { id: "4", name: "Brand Identity", color: "#EF4444" },
      { id: "5", name: "Logo Design", color: "#8B5CF6" },
    ],
    rating: 4.9,
    downloads: 890,
  },
  {
    id: "3",
    title: "Illustration Pack - Modern Characters",
    description:
      "Set of 50 modern character illustrations in various poses and styles, perfect for web and mobile applications.",
    price: 199000,
    slug: "illustration-pack-modern-characters",
    thumbnailUrl:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    categoryId: "3",
    category: { id: "3", name: "Illustrations" },
    tags: [
      { id: "6", name: "Characters", color: "#06B6D4" },
      { id: "7", name: "Vector", color: "#84CC16" },
    ],
    rating: 4.7,
    downloads: 2100,
  },
];

// Buat Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook kustom untuk menggunakan Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Mengambil data dari localStorage saat inisialisasi
    try {
      const storedCartItems = localStorage.getItem("cartItems");
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
      return [];
    }
  });

  // Menyimpan data keranjang ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Jika produk sudah ada, tambahkan kuantitasnya
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Jika produk belum ada, tambahkan sebagai item baru
        return [
          ...prevItems,
          {
            id: Date.now().toString(),
            product,
            quantity,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== itemId); // Hapus jika kuantitas <= 0
      }
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Ekspor mockProducts juga agar bisa digunakan di Cart.tsx
export { mockProducts };
