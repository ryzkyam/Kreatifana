import axios from "axios";
import { Edit, Package, Trash2 } from "lucide-react"; // Import Edit and Trash2 icons
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Product {
  id: string;
  title: string;
  thumbnailUrl: string;
  image: string;
  description: string;
  slug: string;
  price: number;
  oldPrice?: number;
  user: { name: string };
  category: { id: string; name: string }; // Tambahkan ID kategori jika diperlukan untuk form edit
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  followers?: number;
  following?: number;
  location?: string;
  portfolio?: string;
  products?: Product[];
}

// --- Komponen Modal Edit Produk (Contoh Sederhana) ---
interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<Product | null>(product);

  useEffect(() => {
    setFormData(product); // Reset form data ketika product berubah
  }, [product]);

  if (!isOpen || !formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Price (Rp)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          {/* Anda bisa menambahkan input untuk thumbnailUrl, category, dll. di sini */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Komponen Modal Konfirmasi Hapus ---
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Confirm Deletion
        </h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "{itemName}"? This action cannot be
          undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
const BASE_BACKEND_URL =
  "https://kreatifana-backend-production-2d4c.up.railway.app";
const getFullImageUrl = (path: string | undefined | null) => {
  if (!path) {
    return "https://placehold.co/800x600/e0e0e0/505050?text=No+Image"; // Placeholder yang lebih besar untuk halaman detail
  }
  // Jika path sudah berupa URL absolut, langsung gunakan
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("//")
  ) {
    return path;
  }
  // Jika path belum memiliki leading slash, tambahkan
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_BACKEND_URL}${cleanedPath}`;
};
const UserProfilePage: React.FC = () => {
  const { username: usernameFromUrl } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { auth, isLoading: authLoading } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // State untuk modal konfirmasi hapus
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(
    null
  );
  const [productToDeleteTitle, setProductToDeleteTitle] = useState<
    string | null
  >(null);

  // Fungsi untuk mengambil data profil pengguna (termasuk produk)
  const fetchUserProfileData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://kreatifana-backend-production-2d4c.up.railway.app/api/auth/register/api/users/${usernameFromUrl}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      const userFromBackend = response.data.user;

      const fixedUser: UserProfile = {
        id: userFromBackend.id,
        name: userFromBackend.name,
        username:
          userFromBackend.username ||
          userFromBackend.name ||
          `User-${userFromBackend.id.substring(0, 5)}`,
        email: userFromBackend.email,
        bio: userFromBackend.bio || "No bio available.",
        avatar: userFromBackend.avatar || "/images/default-avatar.png",
        followers: userFromBackend.followers || 0,
        following: userFromBackend.following || 0,
        location: userFromBackend.location || "",
        portfolio: userFromBackend.portfolio || "",
        products: (userFromBackend.products || []).map((p: any) => ({
          ...p,
          thumbnailUrl: p.image
            ? `https://kreatifana-backend-production-2d4c.up.railway.app/api/auth/register/uploads/${p.image}`
            : "https://placehold.co/400x300?text=No+Image",
        })),
      };

      setUserProfile(fixedUser);
    } catch (err) {
      console.error("Fetch user profile error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || `Error: ${err.response.statusText}`
        );
        if (err.response.status === 401 || err.response.status === 403) {
          navigate("/LoginPage");
        }
      } else {
        setError("Error fetching profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (authLoading) return;

    // Jika auth.user null, token null, dan usernameFromUrl ada — redirect ke login
    if (!auth.token || !auth.user) {
      console.warn("Token atau user kosong, redirecting...");
      navigate("/LoginPage");
      return;
    }

    // Jika username tidak ada di URL
    if (!usernameFromUrl) {
      setError("Username tidak ditemukan di URL.");
      return;
    }

    // Jika semua sudah valid
    fetchUserProfileData();
  }, [authLoading, auth.token, auth.user, usernameFromUrl, navigate]);

  // --- Fungsi-fungsi CRUD Produk ---

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      // Panggil API PUT untuk update produk
      const response = await axios.put(
        `https://kreatifanabe-production.up.railway.app/api/auth/register/api/products/${updatedProduct.id}`, // Asumsi endpoint update produk
        updatedProduct,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      console.log("Product updated successfully:", response.data);
      // Refresh data profil setelah update
      fetchUserProfileData();
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product. Please try again.");
    } finally {
      setIsEditModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleDeleteClick = (productId: string, productTitle: string) => {
    setProductToDeleteId(productId);
    setProductToDeleteTitle(productTitle);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDeleteId) return;

    try {
      // Panggil API DELETE untuk menghapus produk
      await axios.delete(
        `https://kreatifanabe-production.up.railway.app/api/auth/register/api/products/${productToDeleteId}`, // Asumsi endpoint delete produk
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      console.log("Product deleted successfully:", productToDeleteId);
      // Refresh data profil setelah hapus
      fetchUserProfileData();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setProductToDeleteId(null);
      setProductToDeleteTitle(null);
    }
  };

  // Tampilan loading
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 text-lg font-semibold">
        Loading user profile...
      </div>
    );
  }

  // Tampilan error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 text-lg font-semibold">
        <p>{error}</p>
        {error.includes("Authentication required") && (
          <button
            onClick={() => navigate("/LoginPage")}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  // Tampilan jika profil tidak ditemukan
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 text-lg font-semibold">
        No user profile found. This user might not exist or there's an issue
        with fetching their data.
      </div>
    );
  }

  // Destrukturisasi data userProfile untuk kemudahan penggunaan di JSX
  const {
    name,
    username,
    avatar,
    bio,
    followers,
    following,
    location,
    portfolio,
    products,
  } = userProfile;

  // Tentukan apakah ini profil pengguna yang sedang login
  const isOwnProfile = auth.user && auth.user.username === userProfile.username;

  return (
    <div className="max-w-5xl mx-auto mt-5 p-6">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Bagian Header Profil */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-gray-300 flex-shrink-0">
            <img
              src={avatar || "/images/default-avatar.png"}
              alt={`${name}'s avatar`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold">@{username}</h1>
            <p className="text-gray-600 text-lg">{name}</p>
          </div>
        </div>

        <p className="mt-4 text-gray-700">{bio}</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-600">
          <div>
            <p className="text-sm font-medium">Followers</p>
            <p className="text-lg font-semibold text-gray-900">{followers}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Following</p>
            <p className="text-lg font-semibold text-gray-900">{following}</p>
          </div>
          {location && (
            <div>
              <p className="text-sm font-medium">Location</p>
              <p>{location}</p>
            </div>
          )}
        </div>

        {portfolio && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-sm font-medium">Portfolio</p>
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-words"
            >
              {portfolio}
            </a>
          </div>
        )}
      </div>

      {/* Bagian Daftar Produk yang Diunggah Pengguna */}
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isOwnProfile ? "Produk digital kamu" : `Products by @${username}`} (
          {products ? products.length : 0})
        </h2>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative block hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-200 group"
              >
                {/* Overlay untuk tombol CRUD */}
                {isOwnProfile && (
                  <div className="absolute top-2 right-2 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditClick(product);
                      }}
                      className="p-2 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteClick(product.id, product.title);
                      }}
                      className="p-2 bg-white rounded-full shadow-md text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Link ke detail produk */}
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.thumbnailUrl ? (
                      <img
                        src={getFullImageUrl(product.thumbnailUrl)}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/400x300?text=Image+Not+Found";
                        }}
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-green-600">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-gray-500">
                        {product.category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">
              {isOwnProfile
                ? "You haven't uploaded any products yet."
                : `This user hasn't uploaded any products yet.`}
            </p>
            {isOwnProfile && (
              <Link
                to="/upload-product" // Ganti dengan rute upload produk Anda
                className="inline-flex items-center mt-4 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Upload Your First Product
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Render Modals */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={editingProduct}
        onSave={handleUpdateProduct}
      />
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={productToDeleteTitle || "this product"}
      />
    </div>
  );
};

export default UserProfilePage;
