import {
  Edit,
  Folder,
  Package,
  Plus,
  Save,
  Search,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useState } from "react";

// Interfaces
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
  createdAt?: string;
}

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Design System Template",
    description: "Complete design system with components and guidelines",
    price: 299000,
    slug: "design-system-template",
    thumbnailUrl:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    categoryId: "1",
    category: { id: "1", name: "Design Templates" },
    tags: [
      { id: "1", name: "UI/UX" },
      { id: "2", name: "Figma" },
    ],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Branding Package",
    description: "Complete branding solution for startups",
    price: 500000,
    slug: "branding-package",
    thumbnailUrl:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    categoryId: "2",
    category: { id: "2", name: "Branding" },
    tags: [
      { id: "3", name: "Brand Identity" },
      { id: "4", name: "Logo" },
    ],
    createdAt: "2024-01-10",
  },
];

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Design Templates",
    slug: "design-templates",
    description: "Ready-to-use design templates",
  },
  {
    id: "2",
    name: "Branding",
    slug: "branding",
    description: "Brand identity and logo designs",
  },
  {
    id: "3",
    name: "Illustrations",
    slug: "illustrations",
    description: "Vector and raster illustrations",
  },
];

const mockTags: Tag[] = [
  { id: "1", name: "UI/UX", color: "#3B82F6" },
  { id: "2", name: "Figma", color: "#10B981" },
  { id: "3", name: "Brand Identity", color: "#F59E0B" },
  { id: "4", name: "Logo", color: "#EF4444" },
  { id: "5", name: "Vector", color: "#8B5CF6" },
];

type ModalType = "product" | "category" | "tag" | null;

interface FormData {
  product: {
    title: string;
    description: string;
    price: string;
    slug: string;
    categoryId: string;
    thumbnailFile: File | null;
    resourceFile: File | null;
    selectedTags: string[];
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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "tags"
  >("products");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [tags, setTags] = useState<Tag[]>(mockTags);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    product: {
      title: "",
      description: "",
      price: "",
      slug: "",
      categoryId: "",
      thumbnailFile: null,
      resourceFile: null,
      selectedTags: [],
    },
    category: {
      name: "",
      slug: "",
      description: "",
    },
    tag: {
      name: "",
      color: "#3B82F6",
    },
  });

  const resetForm = () => {
    setFormData({
      product: {
        title: "",
        description: "",
        price: "",
        slug: "",
        categoryId: "",
        thumbnailFile: null,
        resourceFile: null,
        selectedTags: [],
      },
      category: {
        name: "",
        slug: "",
        description: "",
      },
      tag: {
        name: "",
        color: "#3B82F6",
      },
    });
    setEditingId(null);
  };

  const openModal = (type: ModalType, id?: string) => {
    setModalType(type);
    if (id) {
      setEditingId(id);
      // Populate form with existing data
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
            },
          }));
        }
      } else if (type === "category") {
        const category = categories.find((c) => c.id === id);
        if (category) {
          setFormData((prev) => ({
            ...prev,
            category: {
              name: category.name,
              slug: category.slug || "",
              description: category.description || "",
            },
          }));
        }
      } else if (type === "tag") {
        const tag = tags.find((t) => t.id === id);
        if (tag) {
          setFormData((prev) => ({
            ...prev,
            tag: {
              name: tag.name,
              color: tag.color || "#3B82F6",
            },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (modalType === "product") {
        const newProduct: Product = {
          id: editingId || Date.now().toString(),
          title: formData.product.title,
          description: formData.product.description,
          price: parseFloat(formData.product.price),
          slug: formData.product.slug,
          categoryId: formData.product.categoryId,
          category: categories.find(
            (c) => c.id === formData.product.categoryId
          )!,
          tags: tags.filter((t) =>
            formData.product.selectedTags.includes(t.id)
          ),
          thumbnailUrl:
            "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
          createdAt: new Date().toISOString().split("T")[0],
        };

        if (editingId) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingId ? newProduct : p))
          );
        } else {
          setProducts((prev) => [newProduct, ...prev]);
        }
      } else if (modalType === "category") {
        const newCategory: Category = {
          id: editingId || Date.now().toString(),
          name: formData.category.name,
          slug: formData.category.slug,
          description: formData.category.description,
          createdAt: new Date().toISOString().split("T")[0],
        };

        if (editingId) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingId ? newCategory : c))
          );
        } else {
          setCategories((prev) => [newCategory, ...prev]);
        }
      } else if (modalType === "tag") {
        const newTag: Tag = {
          id: editingId || Date.now().toString(),
          name: formData.tag.name,
          color: formData.tag.color,
          createdAt: new Date().toISOString().split("T")[0],
        };

        if (editingId) {
          setTags((prev) => prev.map((t) => (t.id === editingId ? newTag : t)));
        } else {
          setTags((prev) => [newTag, ...prev]);
        }
      }

      setLoading(false);
      closeModal();
    }, 1000);
  };

  const handleDelete = (type: "product" | "category" | "tag", id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      if (type === "product") {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else if (type === "category") {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else if (type === "tag") {
        setTags((prev) => prev.filter((t) => t.id !== id));
      }
    }
  };

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

      {/* Navigation Tabs */}
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
              { key: "tags", label: "Tag", icon: Tag, count: tags.length },
            ].map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Cari ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <button
            onClick={() => openModal(activeTab.slice(0, -1) as ModalType)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>
              Tambah{" "}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
            </span>
          </button>
        </div>

        {/* Products Tab */}
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
                          {product.thumbnailUrl ? (
                            <img
                              src={product.thumbnailUrl}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
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
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
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
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete("product", product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Categories Tab */}
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
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
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
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete("category", category.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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

        {/* Tags Tab */}
        {activeTab === "tags" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredTags.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada tag ditemukan</p>
              </div>
            ) : (
              filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
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
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete("tag", tag.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
      </div>

      {/* Modal */}
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
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalType === "product" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Judul Produk
                      </label>
                      <input
                        type="text"
                        value={formData.product.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            product: { ...prev.product, title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan judul produk"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        value={formData.product.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            product: {
                              ...prev.product,
                              description: e.target.value,
                            },
                          }))
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Deskripsi produk"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          value={formData.product.price}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              product: {
                                ...prev.product,
                                price: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
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
                            setFormData((prev) => ({
                              ...prev,
                              product: {
                                ...prev.product,
                                slug: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="product-slug"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>
                      <select
                        value={formData.product.categoryId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            product: {
                              ...prev.product,
                              categoryId: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

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
                                setFormData((prev) => ({
                                  ...prev,
                                  product: {
                                    ...prev.product,
                                    selectedTags: newTags,
                                  },
                                }));
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              product: {
                                ...prev.product,
                                thumbnailFile: e.target.files?.[0] || null,
                              },
                            }))
                          }
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-sm text-blue-600 hover:text-blue-700">
                            Klik untuk upload thumbnail
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG hingga 5MB
                          </p>
                        </label>
                      </div>
                    </div>
                  </>
                )}

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
                          setFormData((prev) => ({
                            ...prev,
                            category: {
                              ...prev.category,
                              name: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nama kategori"
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
                          setFormData((prev) => ({
                            ...prev,
                            category: {
                              ...prev.category,
                              slug: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="category-slug"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        value={formData.category.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: {
                              ...prev.category,
                              description: e.target.value,
                            },
                          }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Deskripsi kategori"
                      />
                    </div>
                  </>
                )}

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
                          setFormData((prev) => ({
                            ...prev,
                            tag: { ...prev.tag, name: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nama tag"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warna
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={formData.tag.color}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tag: { ...prev.tag, color: e.target.value },
                            }))
                          }
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.tag.color}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tag: { ...prev.tag, color: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingId ? "Update" : "Simpan"}</span>
                      </>
                    )}
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
