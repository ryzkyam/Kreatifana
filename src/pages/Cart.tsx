import {
  ArrowLeft,
  Check,
  CreditCard,
  Download,
  Lock,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Tag as TagIcon,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react"; // Tambahkan useRef
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useCart } from "../context/CartContext"; // Import useCart

// --- Interfaces (pastikan ini sesuai dengan definisi di CartContext dan backend Anda) ---
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  thumbnailUrl?: string; // URL thumbnail produk
  resourceUrl?: string;
  categoryId: string;
  category: { id: string; name: string };
  tags: { id: string; name: string; color?: string }[];
  rating?: number;
  downloads?: number;
}

// Catatan: Jika CartItem di CartContext sudah memiliki product langsung di dalamnya,
// pastikan interface ini konsisten.
interface CartItem {
  id: string; // ID unik item di keranjang (bukan product.id)
  product: Product;
  quantity: number;
  addedAt: string; // Timestamp kapan ditambahkan ke keranjang
}

interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_transfer" | "e_wallet";
  name: string;
  icon: string;
  description: string;
}

interface OrderSummary {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

// --- Data metode pembayaran ---
const paymentMethods: PaymentMethod[] = [
  {
    id: "credit_card",
    type: "credit_card",
    name: "Kartu Kredit/Debit",
    icon: "💳",
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "bank_transfer",
    type: "bank_transfer",
    name: "Transfer Bank",
    icon: "🏦",
    description: "BCA, Mandiri, BNI, BRI",
  },
  {
    id: "gopay",
    type: "e_wallet",
    name: "GoPay",
    icon: "📱",
    description: "Bayar dengan GoPay",
  },
  {
    id: "ovo",
    type: "e_wallet",
    name: "OVO",
    icon: "💜",
    description: "Bayar dengan OVO",
  },
  {
    id: "dana",
    type: "e_wallet",
    name: "DANA",
    icon: "💙",
    description: "Bayar dengan DANA",
  },
];

// --- Fungsi untuk mendapatkan URL gambar lengkap ---
// Pastikan VITE_APP_BACKEND_URL diatur di file .env Anda (misal: VITE_APP_BACKEND_URL=http://localhost:3000)
const BASE_BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ||
  "https://kreatifanabe-production-0403.up.railway.app";

const getFullImageUrl = (path: string | undefined | null): string => {
  if (!path) {
    return "https://placehold.co/50x50/e0e0e0/505050?text=No+Img"; // Placeholder jika tidak ada gambar
  }
  // Cek apakah path sudah merupakan URL lengkap
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("//")
  ) {
    return path;
  }
  // Hapus '/' di awal jika ada untuk menghindari '//' di URL
  const cleanedPath = path.startsWith("/") ? path.substring(1) : path;
  return `${BASE_BACKEND_URL}/${cleanedPath}`;
};

const Cart: React.FC = () => {
  // Gunakan useCart hook untuk mengakses state dan fungsi keranjang
  const { cartItems, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCart();
  const { auth } = useAuth(); // Dapatkan data auth untuk email user

  const [currentStep, setCurrentStep] = useState<
    "cart" | "checkout" | "payment" | "success"
  >("cart");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // --- STATE BARU UNTUK MENYIMPAN DATA ORDER SETELAH BERHASIL ---
  // Ini akan menyimpan snapshot keranjang dan ringkasan saat pembayaran berhasil
  const [confirmedOrderItems, setConfirmedOrderItems] = useState<CartItem[]>(
    []
  );
  const [finalOrderSummary, setFinalOrderSummary] =
    useState<OrderSummary>(orderSummary);
  // Order ID yang akan tetap sama selama di halaman sukses
  const orderId = useRef(
    `ORD-${Date.now().toString().slice(-8)}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`
  ).current;
  // --- AKHIR STATE BARU ---

  // Calculate order summary
  useEffect(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * 0.11; // 11% PPN (contoh)
    const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount if promo applied (contoh)
    const total = subtotal + tax - discount;

    setOrderSummary({ subtotal, tax, discount, total });
  }, [cartItems, promoApplied]);

  // Fungsi untuk menerapkan kode promo
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true);
      setPromoCode(""); // Kosongkan input setelah diterapkan
    } else {
      alert("Kode promo tidak valid!"); // Contoh feedback
    }
  };

  // Fungsi untuk menghapus kode promo
  const removePromoCode = () => {
    setPromoApplied(false);
  };

  // Navigasi langkah checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong. Tambahkan produk sebelum checkout!");
      return;
    }
    setCurrentStep("checkout");
  };

  const proceedToPayment = () => {
    setCurrentStep("payment");
  };

  // Fungsi untuk memproses pembayaran
  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Silakan pilih metode pembayaran terlebih dahulu.");
      return;
    }

    setLoading(true);

    // --- PENTING: Simpan snapshot keranjang dan ringkasan sebelum clearCart ---
    setConfirmedOrderItems([...cartItems]); // Buat salinan item di keranjang
    setFinalOrderSummary(orderSummary); // Simpan ringkasan final

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setCurrentStep("success");
      clearCart(); // Kosongkan keranjang setelah pembayaran berhasil dikonfirmasi
    }, 3000); // Simulasi 3 detik proses pembayaran
  };

  // Fungsi untuk mereset semua state ke kondisi awal (kembali ke beranda/keranjang kosong)
  const resetAll = () => {
    clearCart(); // Bersihkan keranjang di context
    setCurrentStep("cart");
    setSelectedPaymentMethod("");
    setPromoApplied(false);
    setPromoCode("");
    setConfirmedOrderItems([]); // Hapus item yang dikonfirmasi juga
    // finalOrderSummary akan di-reset secara implisit saat kembali ke 'cart'
  };

  // --- Fungsi untuk mengunduh struk pemesanan ---
  const handleDownloadReceipt = () => {
    const receiptContent = `
========================================
         STRUK PEMESANAN REATIFANA
========================================
Order ID: ${orderId}
Tanggal: ${new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}
Email Pembeli: ${auth.user?.email || "N/A"}
Metode Pembayaran: ${
      paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name || "N/A"
    }
----------------------------------------
Detail Produk:
${confirmedOrderItems
  .map(
    (item) => `
- ${item.product.title}
  Harga: Rp ${item.product.price.toLocaleString("id-ID")}
  Jumlah: ${item.quantity}
  Subtotal: Rp ${(item.product.price * item.quantity).toLocaleString("id-ID")}
`
  )
  .join("")}
----------------------------------------
Ringkasan Pembayaran:
Subtotal: Rp ${finalOrderSummary.subtotal.toLocaleString("id-ID")}
${
  promoApplied
    ? `Diskon (10%): -Rp ${finalOrderSummary.discount.toLocaleString("id-ID")}`
    : ""
}
PPN (11%): Rp ${finalOrderSummary.tax.toLocaleString("id-ID")}
Total Pembayaran: Rp ${finalOrderSummary.total.toLocaleString("id-ID")}
========================================
Produk Digital akan dikirim ke email Anda.
Terima kasih atas pemesanan Anda!
========================================
    `;

    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `struk_pemesanan_${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // --- Akhir Fungsi Download Struk ---

  // --- Render Halaman Sukses ---
  if (currentStep === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pemesanan Berhasil!
          </h1>
          <p className="text-gray-600 mb-6">
            Terima kasih atas Pemesanan Anda. Produk Digital akan dikirim ke
            email Anda.
          </p>

          {/* Bagian Detail Produk dari Pesanan */}
          {confirmedOrderItems.length > 0 && (
            <div className="mb-6 border-t border-b border-gray-200 py-4 text-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Detail Pesanan Anda:
              </h2>
              {confirmedOrderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 mb-3 last:mb-0"
                >
                  <img
                    src={getFullImageUrl(item.product.thumbnailUrl)}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">
                      {item.product.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Jumlah: {item.quantity} x Rp{" "}
                      {item.product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    Rp{" "}
                    {(item.product.price * item.quantity).toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">
                  Total Pembayaran:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  Rp {finalOrderSummary.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Struk Produk</span>
            </button>
            <button
              onClick={resetAll}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
          <p className="text-sm text-gray-500">Order ID: #{orderId}</p>
        </div>
      </div>
    );
  }

  // --- Render Halaman Cart, Checkout, dan Payment (Lanjutan dari kode Anda) ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentStep !== "cart" && (
                <button
                  onClick={() =>
                    setCurrentStep(
                      currentStep === "checkout" ? "cart" : "checkout"
                    )
                  }
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentStep === "cart" && "Keranjang Belanja"}
                  {currentStep === "checkout" && "Checkout"}
                  {currentStep === "payment" && "Pembayaran"}
                </h1>
                <p className="text-gray-600">
                  {currentStep === "cart" &&
                    `${cartItems.length} item dalam keranjang`}
                  {currentStep === "checkout" && "Konfirmasi pesanan Anda"}
                  {currentStep === "payment" && "Pilih metode pembayaran"}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center space-x-4">
              {[
                { key: "cart", label: "Keranjang", icon: ShoppingCart },
                { key: "checkout", label: "Checkout", icon: Package },
                { key: "payment", label: "Pemesanan", icon: CreditCard },
              ].map(({ key, label, icon: Icon }, index) => (
                <div key={key} className="flex items-center">
                  <div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      currentStep === key
                        ? "bg-blue-100 text-blue-700"
                        : index <
                          ["cart", "checkout", "payment"].indexOf(currentStep)
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  {index < 2 && (
                    <div className="w-8 h-px bg-gray-300 mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cart Step */}
        {currentStep === "cart" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cartItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Keranjang Kosong
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Belum ada produk dalam keranjang Anda
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.product.thumbnailUrl ? (
                            <img
                              src={getFullImageUrl(item.product.thumbnailUrl)}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {item.product.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {item.product.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span>{item.product.rating}</span>
                                </span>
                                <span>•</span>
                                <span>
                                  {item.product.downloads?.toLocaleString()}{" "}
                                  downloads
                                </span>
                                <span>•</span>
                                <span>{item.product.category.name}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.product.tags.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="px-2 py-1 text-xs rounded-full"
                                    style={{
                                      backgroundColor: `${tag.color}20`,
                                      color: tag.color,
                                    }}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900 mb-4">
                                Rp{" "}
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString("id-ID")}
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary - Cart Step */}
            {cartItems.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ringkasan Pesanan
                  </h3>

                  {/* Promo Code */}
                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Kode promo"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Terapkan
                      </button>
                    </div>
                    {promoApplied && (
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-green-600 flex items-center space-x-1">
                          <TagIcon className="w-4 h-4" />
                          <span>WELCOME10 diterapkan</span>
                        </span>
                        <button
                          onClick={removePromoCode}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>
                        Rp {orderSummary.subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon (10%)</span>
                        <span>
                          -Rp {orderSummary.discount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>PPN (11%)</span>
                      <span>Rp {orderSummary.tax.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>
                          Rp {orderSummary.total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Lanjut ke Checkout</span>
                  </button>

                  <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Lock className="w-4 h-4" />
                      <span>Pembayaran Aman</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checkout Step */}
        {currentStep === "checkout" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Konfirmasi Pesanan
                </h3>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.thumbnailUrl ? (
                          <img
                            src={getFullImageUrl(item.product.thumbnailUrl)}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          Rp{" "}
                          {(item.product.price * item.quantity).toLocaleString(
                            "id-ID"
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Informasi Pengiriman
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Produk Digital
                        </p>
                        <p className="text-sm text-blue-700">
                          Pemesanan Produk akan dikirim ke email Kreator setelah
                          Pemesanan berhasil diverifikasi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ringkasan Pembayaran
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      Rp {orderSummary.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Diskon (10%)</span>
                      <span>
                        -Rp {orderSummary.discount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>PPN (11%)</span>
                    <span>Rp {orderSummary.tax.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>
                        Rp {orderSummary.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToPayment}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lanjut ke Pemesanan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === "payment" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Pilih Metode Pembayaran
                </h3>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedPaymentMethod === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-2xl">{method.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPaymentMethod === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {selectedPaymentMethod && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Lock className="w-4 h-4" />
                      <span>
                        Pembayaran Anda dilindungi dengan enkripsi SSL 256-bit
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Dengan melanjutkan, Anda menyetujui syarat dan ketentuan
                      pembelian produk digital.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Total Pembayaran
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      Rp {orderSummary.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Diskon (10%)</span>
                      <span>
                        -Rp {orderSummary.discount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>PPN (11%)</span>
                    <span>Rp {orderSummary.tax.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>
                        Rp {orderSummary.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  disabled={!selectedPaymentMethod || loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pesan Sekarang</span>
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span>Transaksi Aman & Terenkripsi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
