import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Package,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';

// Interfaces
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  thumbnailUrl?: string;
  categoryId: string;
  category: { id: string; name: string };
  tags: { id: string; name: string; color?: string }[];
  rating?: number;
  downloads?: number;
  isFavorite?: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  tags: string[];
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Design System Template Pro',
    description: 'Complete design system with 200+ components, design tokens, and comprehensive guidelines for modern web applications.',
    price: 299000,
    slug: 'design-system-template-pro',
    thumbnailUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    categoryId: '1',
    category: { id: '1', name: 'Design Templates' },
    tags: [
      { id: '1', name: 'UI/UX', color: '#3B82F6' },
      { id: '2', name: 'Figma', color: '#10B981' },
      { id: '3', name: 'Premium', color: '#F59E0B' }
    ],
    rating: 4.8,
    downloads: 1250,
    isFavorite: false
  },
  {
    id: '2',
    title: 'Brand Identity Package',
    description: 'Complete branding solution including logo variations, color palettes, typography guidelines, and brand applications.',
    price: 450000,
    slug: 'brand-identity-package',
    thumbnailUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    categoryId: '2',
    category: { id: '2', name: 'Branding' },
    tags: [
      { id: '4', name: 'Brand Identity', color: '#EF4444' },
      { id: '5', name: 'Logo Design', color: '#8B5CF6' }
    ],
    rating: 4.9,
    downloads: 890,
    isFavorite: true
  },
  {
    id: '3',
    title: 'Illustration Pack - Modern Characters',
    description: 'Set of 50 modern character illustrations in various poses and styles, perfect for web and mobile applications.',
    price: 199000,
    slug: 'illustration-pack-modern-characters',
    thumbnailUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    categoryId: '3',
    category: { id: '3', name: 'Illustrations' },
    tags: [
      { id: '6', name: 'Characters', color: '#06B6D4' },
      { id: '7', name: 'Vector', color: '#84CC16' }
    ],
    rating: 4.7,
    downloads: 2100,
    isFavorite: false
  },
  {
    id: '4',
    title: 'Mobile App UI Kit',
    description: 'Comprehensive mobile app UI kit with 100+ screens, components, and interactive prototypes for iOS and Android.',
    price: 350000,
    slug: 'mobile-app-ui-kit',
    thumbnailUrl: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
    categoryId: '1',
    category: { id: '1', name: 'Design Templates' },
    tags: [
      { id: '1', name: 'UI/UX', color: '#3B82F6' },
      { id: '8', name: 'Mobile', color: '#F97316' }
    ],
    rating: 4.6,
    downloads: 756,
    isFavorite: false
  },
  {
    id: '5',
    title: 'Icon Set - Business & Finance',
    description: 'Professional icon set with 200+ business and finance icons in multiple formats (SVG, PNG, AI).',
    price: 149000,
    slug: 'icon-set-business-finance',
    thumbnailUrl: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    categoryId: '4',
    category: { id: '4', name: 'Icons' },
    tags: [
      { id: '9', name: 'Icons', color: '#EC4899' },
      { id: '10', name: 'Business', color: '#6366F1' }
    ],
    rating: 4.5,
    downloads: 1890,
    isFavorite: true
  },
  {
    id: '6',
    title: 'Website Template - SaaS Landing',
    description: 'Modern SaaS landing page template with responsive design, animations, and conversion-optimized sections.',
    price: 199000,
    slug: 'website-template-saas-landing',
    thumbnailUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg',
    categoryId: '5',
    category: { id: '5', name: 'Web Templates' },
    tags: [
      { id: '11', name: 'SaaS', color: '#14B8A6' },
      { id: '12', name: 'Landing Page', color: '#F59E0B' }
    ],
    rating: 4.8,
    downloads: 634,
    isFavorite: false
  }
];

const mockCategories: Category[] = [
  { id: '1', name: 'Design Templates', count: 2 },
  { id: '2', name: 'Branding', count: 1 },
  { id: '3', name: 'Illustrations', count: 1 },
  { id: '4', name: 'Icons', count: 1 },
  { id: '5', name: 'Web Templates', count: 1 }
];

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating' | 'popular'>('newest');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 1000000],
    rating: 0,
    tags: []
  });

  const toggleFavorite = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    // Show success feedback
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || product.categoryId === filters.category;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesRating = !filters.rating || (product.rating && product.rating >= filters.rating);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popular':
          return (b.downloads || 0) - (a.downloads || 0);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 1000000],
      rating: 0,
      tags: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Katalog Produk</h1>
            <p className="mt-2 text-gray-600">Temukan produk digital terbaik untuk kebutuhan kreatif Anda</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari produk, kategori, atau tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-lg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Terbaru</option>
              <option value="price-low">Harga: Rendah ke Tinggi</option>
              <option value="price-high">Harga: Tinggi ke Rendah</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="popular">Paling Populer</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
            </button>

            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Kategori</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filters.category === ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Semua Kategori</span>
                    </label>
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={filters.category === category.id}
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category.name} ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Rentang Harga</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: [prev.priceRange[0], parseInt(e.target.value) || 1000000]
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Rating Minimum</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating}
                          onChange={(e) => setFilters(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-2 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">& ke atas</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Menampilkan {filteredProducts.length} dari {products.length} produk
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-gray-600 mb-4">Coba ubah filter atau kata kunci pencarian Anda</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-6'
              }>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-video'}`}>
                      {product.thumbnailUrl ? (
                        <img 
                          src={product.thumbnailUrl} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className={`p-2 rounded-full transition-colors ${
                              product.isFavorite 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${product.isFavorite ? 'fill-current' : ''}`} />
                          </button>
                          <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <span className="text-sm font-semibold text-gray-900">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {product.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{product.downloads?.toLocaleString()}</span>
                        </div>
                        <span>•</span>
                        <span>{product.category.name}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ 
                              backgroundColor: `${tag.color}20`, 
                              color: tag.color 
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                        {product.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            +{product.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Tambah ke Keranjang</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;