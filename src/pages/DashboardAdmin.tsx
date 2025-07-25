import {
  Edit,
  Folder,
  Package,
  Plus,
  Search,
  Tag as TagIcon,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

/***************************
 * Types & Interfaces
 **************************/
interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  createdAt?: string;
}

interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt?: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  thumbnailUrl?: string;
  resourceUrl?: string;
  categoryId: string;
  category: Category;
  tags: Tag[];
  features: ProductFeatureInput[]; // ✅ Tambahkan ini
  createdAt?: string;
}

/***************************
 * Helper – Base URL
 **************************/
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://kreatifanabe-production.up.railway.app/api";
const plural = {
  product: "products",
  category: "categories",
  tag: "tags",
  feature: "features",
} as const;
/***************************
 * Form Data Shape
 **************************/
interface ProductFeatureInput {
  name: string;
  description: string;
  iconClass: string;
}
interface FormDataShape {
  product: {
    title: string;
    description: string;
    price: string;
    slug: string;
    categoryId: string;
    thumbnailFile: File | null;
    resourceFile: File | null;
    selectedTags: string[];
    features: ProductFeatureInput[]; // Tambahan
  };
  category: {
    name: string;
    slug: string;
    description: string;
  };
  tag: {
    name: string;
    color: string;
  };
}

/***************************
 * Component
 **************************/
const AdminDashboard: React.FC = () => {
  const { auth } = useAuth();

  /***** Tabs & Modal *****/
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "tags"
  >("products");
  const [modalType, setModalType] = useState<
    "product" | "category" | "tag" | null
  >(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // mappiing tab prula to modalsingular
  const tabToModal = {
    products: "product",
    categories: "category",
    tags: "tag",
  } as const;

  /***** UI State *****/
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  /***** Data State *****/
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  /***** Form State *****/
  const defaultForm: FormDataShape = {
    product: {
      title: "",
      description: "",
      price: "",
      slug: "",
      categoryId: "",
      thumbnailFile: null,
      resourceFile: null,
      selectedTags: [],
      features: [], // <- tambahkan ini
    },
    category: { name: "", slug: "", description: "" },
    tag: { name: "", color: "#3B82F6" },
  };

  const [formData, setFormData] = useState<FormDataShape>(defaultForm);

  /***************************
   * Fetch helpers
   **************************/
  const authHeader = () => ({ Authorization: `Bearer ${auth?.token}` });

  /**
   * Ambil data produk, kategori, tag.
   * Backend mengembalikan: { success: true, products: [...], pagination: {...} }
   * Pastikan kita set array agar aman.
   */
  const fetchAll = async () => {
    try {
      setInitialLoad(true);
      const [pRes, cRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/products`, { headers: authHeader() }),
        fetch(`${API_BASE}/categories`, { headers: authHeader() }),
        fetch(`${API_BASE}/tags`, { headers: authHeader() }),
      ]);

      if (!pRes.ok || !cRes.ok || !tRes.ok)
        throw new Error("Gagal memuat data.");

      const { products: pArr = [] } = await pRes.json();
      const { categories: cArr = [] } = await cRes.json();
      const { tags: tArr = [] } = await tRes.json();

      setProducts(Array.isArray(pArr) ? pArr : []);
      setCategories(Array.isArray(cArr) ? cArr : []);
      setTags(Array.isArray(tArr) ? tArr : []);
    } catch (err: any) {
      toast.error(err.message || "Tidak bisa mengambil data dari server");
      setProducts([]);
      setCategories([]);
      setTags([]);
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /***************************
   * Modal helpers
   **************************/
  const resetForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
  };

  const openModal = (type: typeof modalType, id?: string) => {
    setModalType(type);
    if (id) {
      setEditingId(id);
      if (type === "product") {
        const product = products.find((p) => p.id === id);
        if (product) {
          setFormData((prev) => ({
            ...prev,
            product: {
              title: product.title,
              description: product.description,
              price: product.price.toString(),
              slug: product.slug,
              categoryId: product.categoryId,
              thumbnailFile: null,
              resourceFile: null,
              selectedTags: product.tags.map((t) => t.id),
              features: product.features || [], // ✅ tambahkan ini
            },
          }));
        }
      }
      if (type === "category") {
        const cat = categories.find((c) => c.id === id);
        if (cat) {
          setFormData((prev) => ({
            ...prev,
            category: {
              name: cat.name,
              slug: cat.slug || "",
              description: cat.description || "",
            },
          }));
        }
      }
      if (type === "tag") {
        const tg = tags.find((t) => t.id === id);
        if (tg) {
          setFormData((prev) => ({
            ...prev,
            tag: { name: tg.name, color: tg.color || "#3B82F6" },
          }));
        }
      }
    } else {
      resetForm();
    }
  };

  const closeModal = () => {
    setModalType(null);
    resetForm();
  };

  /***************************
   * Submit / Delete handlers
   **************************/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalType) return;
    setLoading(true);

    try {
      if (modalType === "product") {
        /***** PRODUCT *****/
        const fd = new FormData();
        const f = formData.product;
        fd.append("title", f.title);
        fd.append("description", f.description);
        fd.append("price", f.price);
        fd.append("slug", f.slug);
        fd.append("categoryId", f.categoryId);
        f.selectedTags.forEach((t) => fd.append("tags", t));
        if (f.thumbnailFile) fd.append("thumbnail", f.thumbnailFile);
        if (f.resourceFile) fd.append("resource", f.resourceFile);

        const method = editingId ? "PUT" : "POST";
        const url = editingId
          ? `${API_BASE}/products/${editingId}`
          : `${API_BASE}/products`;
        const res = await fetch(url, {
          method,
          headers: authHeader(),
          body: fd,
        });
        if (!res.ok) throw new Error("Gagal menyimpan produk.");
        toast.success(editingId ? "Produk diperbarui" : "Produk ditambahkan");
      }
      if (modalType === "category") {
        /***** CATEGORY *****/
        const body = JSON.stringify(formData.category);
        const method = editingId ? "PUT" : "POST";
        const url = editingId
          ? `${API_BASE}/categories/${editingId}`
          : `${API_BASE}/categories`;
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", ...authHeader() },
          body,
        });
        if (!res.ok) throw new Error("Gagal menyimpan kategori.");
        toast.success(
          editingId ? "Kategori diperbarui" : "Kategori ditambahkan"
        );
      }
      if (modalType === "tag") {
        /***** TAG *****/
        const body = JSON.stringify(formData.tag);
        const method = editingId ? "PUT" : "POST";
        const url = editingId
          ? `${API_BASE}/tags/${editingId}`
          : `${API_BASE}/tags`;
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", ...authHeader() },
          body,
        });
        if (!res.ok) throw new Error("Gagal menyimpan tag.");
        toast.success(editingId ? "Tag diperbarui" : "Tag ditambahkan");
      }

      // refresh list
      await fetchAll();
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    type: "product" | "category" | "tag",
    id: string
  ) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus item ini?")) return;
    try {
      const url = `${API_BASE}/${plural[type]}/${id}`;
      const res = await fetch(url, { method: "DELETE", headers: authHeader() });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus");
      await fetchAll();
    } catch (err: any) {
      toast.error(err.message || "Tidak bisa menghapus item");
    }
  };

  /***************************
   * Filtering (client-side)
   **************************/
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /***************************
   * Render early loading
   **************************/
  if (initialLoad) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Memuat dashboard...
      </div>
    );
  }

  /***************************
   * JSX
   **************************/
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Admin
            </h1>
            <p className="mt-2 text-gray-600">
              Kelola produk, kategori, dan tag untuk komunitas kreatif Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              {
                key: "products",
                label: "Produk",
                icon: Package,
                count: products.length,
              },
              {
                key: "categories",
                label: "Kategori",
                icon: Folder,
                count: categories.length,
              },
              { key: "tags", label: "Tag", icon: TagIcon, count: tags.length },
            ].map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={
                  activeTab === key
                    ? "flex items-center space-x-2 py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
                    : "flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                }
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search + Add */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Cari ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <button
            onClick={() => openModal(tabToModal[activeTab])}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>
              Tambah {/* Logika untuk menampilkan nama singular yang benar */}
              {activeTab === "products" && "Produk"}
              {activeTab === "categories" && "Kategori"}
              {activeTab === "tags" && "Tag"}
              {activeTab === "features" && "Fitur"}
            </span>
          </button>
        </div>

        {/********************** Products Tab ************************/}
        {activeTab === "products" && (
          <div className="grid gap-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada produk ditemukan</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4 flex-1">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {/* Menampilkan thumbnail produk jika ada */}
                          {product.thumbnailUrl ? (
                            <img
                              src={product.thumbnailUrl}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null; // prevents looping
                                e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {product.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span className="font-semibold text-green-600">
                              Rp {product.price.toLocaleString("id-ID")}
                            </span>
                            <span>•</span>
                            <span>{product.category.name}</span>
                            <span>•</span>
                            <span>{product.createdAt}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {product.tags.map((tag) => (
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
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => openModal("product", product.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete("product", product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/********************** Categories Tab ************************/}
        {activeTab === "categories" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada kategori ditemukan</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Folder className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {category.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openModal("category", category.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete("category", category.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {category.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      Dibuat: {category.createdAt}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {/********************** Tags Tab ************************/}
        {activeTab === "tags" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredTags.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada tag ditemukan</p>
              </div>
            ) : (
              filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        ></div>
                        <span className="font-medium text-gray-900">
                          {tag.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openModal("tag", tag.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete("tag", tag.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{tag.createdAt}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/********************** Features Tab ************************/}
        {activeTab === "features" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeatures.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />{" "}
                {/* Ganti ikon jika ada */}
                <p className="text-gray-500">Tidak ada fitur ditemukan</p>
              </div>
            ) : (
              filteredFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {/* Menampilkan ikon fitur jika ada */}
                        {feature.iconClass ? (
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            {/* Anda perlu memastikan `feature.iconClass` bisa dirender sebagai ikon.
                                  Jika menggunakan Font Awesome, pastikan CSS-nya sudah diimpor.
                                  Jika menggunakan Lucide React, Anda perlu mem-mapping string ke komponen ikon.
                                  Untuk demo ini, saya akan menggunakan Lucide React's Star sebagai placeholder.
                              */}
                            <Package className="w-5 h-5 text-purple-600" />{" "}
                            {/* Placeholder icon */}
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TagIcon className="w-5 h-5 text-purple-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {feature.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {feature.iconClass || "No Icon Class"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openModal("feature", feature.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete("feature", feature.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {feature.description || "Tidak ada deskripsi."}
                    </p>
                    <div className="text-xs text-gray-500">
                      Dibuat: {feature.createdAt}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/****************************** Modal ******************************/}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Edit" : "Tambah"}{" "}
                  {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalType === "product" && (
                  <>
                    {/***** title *****/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Judul Produk
                      </label>
                      <input
                        type="text"
                        value={formData.product.title}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            product: { ...p.product, title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {/***** description *****/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        rows={4}
                        value={formData.product.description}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            product: {
                              ...p.product,
                              description: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {/***** price & slug *****/}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          value={formData.product.price}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              product: { ...p.product, price: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={formData.product.slug}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              product: { ...p.product, slug: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    {/***** category *****/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>

                      <select
                        value={formData.product.categoryId}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            product: {
                              ...p.product,
                              categoryId: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/***** tags *****/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {tags.map((tag) => (
                          <label
                            key={tag.id}
                            className="flex items-center space-x-2 py-1"
                          >
                            <input
                              type="checkbox"
                              checked={formData.product.selectedTags.includes(
                                tag.id
                              )}
                              onChange={(e) => {
                                const newTags = e.target.checked
                                  ? [...formData.product.selectedTags, tag.id]
                                  : formData.product.selectedTags.filter(
                                      (id) => id !== tag.id
                                    );
                                setFormData((p) => ({
                                  ...p,
                                  product: {
                                    ...p.product,
                                    selectedTags: newTags,
                                  },
                                }));
                              }}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <div className="flex items-center space-x-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              ></div>
                              <span className="text-sm">{tag.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/***** thumbnail *****/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              product: {
                                ...p.product,
                                thumbnailFile: e.target.files?.[0] || null,
                              },
                            }))
                          }
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                        >
                          Klik untuk upload thumbnail
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG hingga 5MB
                        </p>
                        {formData.product.thumbnailFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            File terpilih: {formData.product.thumbnailFile.name}
                          </p>
                        )}
                        {/* Jika mengedit, tampilkan thumbnail lama */}
                        {editingId &&
                          products.find((p) => p.id === editingId)
                            ?.thumbnailUrl &&
                          !formData.product.thumbnailFile && (
                            <div className="mt-2 text-xs text-gray-500">
                              Thumbnail saat ini:{" "}
                              <a
                                href={
                                  products.find((p) => p.id === editingId)
                                    ?.thumbnailUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Lihat
                              </a>
                            </div>
                          )}
                      </div>
                    </div>
                    {/***** resource file (optional for digital products) *****/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        File Sumber (Opsional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              product: {
                                ...p.product,
                                resourceFile: e.target.files?.[0] || null,
                              },
                            }))
                          }
                          className="hidden"
                          id="resource-upload"
                        />
                        <label
                          htmlFor="resource-upload"
                          className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                        >
                          Klik untuk upload file sumber (PSD, AI, PDF, dll.)
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Max 20MB</p>
                        {formData.product.resourceFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            File terpilih: {formData.product.resourceFile.name}
                          </p>
                        )}
                        {/* Jika mengedit, tampilkan resource file lama */}
                        {editingId &&
                          products.find((p) => p.id === editingId)
                            ?.resourceUrl &&
                          !formData.product.resourceFile && (
                            <div className="mt-2 text-xs text-gray-500">
                              File Sumber saat ini:{" "}
                              <a
                                href={
                                  products.find((p) => p.id === editingId)
                                    ?.resourceUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Lihat
                              </a>
                            </div>
                          )}
                      </div>
                    </div>
                  </>
                )}

                {/***** CATEGORY MODAL *****/}
                {modalType === "category" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Kategori
                      </label>
                      <input
                        type="text"
                        value={formData.category.name}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            category: { ...p.category, name: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={formData.category.slug}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            category: { ...p.category, slug: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi Kategori (Opsional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.category.description}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            category: {
                              ...p.category,
                              description: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {/***** TAG MODAL *****/}
                {modalType === "tag" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Tag
                      </label>
                      <input
                        type="text"
                        value={formData.tag.name}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            tag: { ...p.tag, name: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warna Tag
                      </label>
                      <input
                        type="color"
                        value={formData.tag.color}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            tag: { ...p.tag, color: e.target.value },
                          }))
                        }
                        className="w-full h-10 px-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Pilih warna yang akan muncul di tag
                      </p>
                    </div>
                  </>
                )}

                {/***** FEATURE MODAL *****/}
                {/***** features *****/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fitur Produk
                  </label>
                  {formData.product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="mb-2 border border-gray-300 rounded-lg p-3 space-y-2"
                    >
                      <input
                        type="text"
                        placeholder="Nama fitur"
                        value={feature.name}
                        onChange={(e) =>
                          setFormData((p) => {
                            const newFeatures = [...p.product.features];
                            newFeatures[idx].name = e.target.value;
                            return {
                              ...p,
                              product: { ...p.product, features: newFeatures },
                            };
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Deskripsi fitur"
                        value={feature.description}
                        onChange={(e) =>
                          setFormData((p) => {
                            const newFeatures = [...p.product.features];
                            newFeatures[idx].description = e.target.value;
                            return {
                              ...p,
                              product: { ...p.product, features: newFeatures },
                            };
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Icon class (misalnya: lucide-star)"
                        value={feature.iconClass}
                        onChange={(e) =>
                          setFormData((p) => {
                            const newFeatures = [...p.product.features];
                            newFeatures[idx].iconClass = e.target.value;
                            return {
                              ...p,
                              product: { ...p.product, features: newFeatures },
                            };
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            product: {
                              ...p.product,
                              features: p.product.features.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }
                        className="text-red-500 text-sm hover:underline"
                      >
                        Hapus fitur
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        product: {
                          ...p.product,
                          features: [
                            ...p.product.features,
                            { name: "", description: "", iconClass: "" },
                          ],
                        },
                      }))
                    }
                    className="mt-2 text-blue-600 text-sm hover:underline"
                  >
                    + Tambah Fitur
                  </button>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingId ? "Perbarui" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
