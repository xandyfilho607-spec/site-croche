import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Search, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Hero } from '../../components/shop/Hero';
import { CategoryFilter } from '../../components/shop/CategoryFilter';
import { ProductCard } from '../../components/shop/ProductCard';
import { ProductDetailModal } from '../../components/shop/ProductDetailModal';
import { CartDrawer } from '../../components/shop/CartDrawer';
import { WhatsAppCheckoutModal } from '../../components/shop/WhatsAppCheckoutModal';
import { AboutSection } from '../../components/shop/AboutSection';
import { ContactSection } from '../../components/shop/ContactSection';
import { useCart } from '../../context/CartContext';

export function HomePage({ onNavigateToAdmin }) {
  const { addItem } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros de produtos
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc', 'name'

  // Modal de Detalhe do Produto
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Carregar dados iniciais do Neon
  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [prodsRes, catsRes, setsRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getSettings().catch(() => ({ data: null })),
      ]);

      setProducts(prodsRes?.data || []);
      setCategories(catsRes?.data || []);
      if (setsRes?.data) {
        setSettings(setsRes.data);
      }
    } catch (err) {
      console.error('Erro ao carregar loja:', err);
      setError(err.message || 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtragem e ordenação no cliente
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== null) {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Produtos destacados para a seção de Destaques
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured);
  }, [products]);

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-earth-900">
      {/* Barra de Navegação */}
      <Navbar settings={settings} onNavigateToAdmin={onNavigateToAdmin} />

      {/* Hero Section */}
      <Hero
        onExploreClick={(e) => {
          e.preventDefault();
          const target = document.getElementById('catalogo');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Tratamento de Erro de Conexão */}
      {error && (
        <div className="max-w-4xl mx-auto my-8 p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-rose-900">
            Conexão com o banco de dados pendente
          </h3>
          <p className="text-sm text-rose-700 max-w-md mx-auto font-light">
            {error}
          </p>
          <div className="pt-2">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      )}

      {/* Seção Categorias */}
      <section id="categorias" className="py-12 bg-cream-100/40 border-b border-cream-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-600">
                Explore por Estilo
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
                Nossas Categorias
              </h2>
            </div>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => {
              setSelectedCategory(id);
              const target = document.getElementById('catalogo');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </section>

      {/* Seção de Produtos em Destaque */}
      {featuredProducts.length > 0 && (
        <section id="destaques" className="py-16 bg-cream-50 border-b border-cream-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold uppercase tracking-wider border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>Coleção em Destaque</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
                As Peças Queridinhas
              </h2>
              <p className="text-sm text-earth-600 font-light">
                Modelos artesanais mais admirados, tecidos com pontos exclusivos e caimento impecável.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={handleOpenDetails}
                  onQuickAdd={(p) => addItem(p, 1)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo Completo */}
      <section id="catalogo" className="py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-cream-200 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-600">
                Loja Artesanal
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
                Catálogo de Peças
              </h2>
            </div>

            {/* Barra de Busca e Ordenação */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Campo de Busca */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar peça de crochê..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-cream-100/50 focus:outline-none focus:border-sage-500 focus:bg-white text-earth-900 transition-all"
                />
              </div>

              {/* Ordenação */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <SlidersHorizontal className="w-4 h-4 text-earth-500 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-cream-300 bg-cream-100/50 text-earth-800 focus:outline-none focus:border-sage-500"
                >
                  <option value="featured">Destaques Primeiro</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name">Nome (A - Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listagem com Loading / Vazio / Cards */}
          {loading ? (
            <div className="py-20">
              <LoadingSpinner size="lg" text="Carregando catálogo artesanal do Neon..." />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-cream-100/40 rounded-3xl border border-cream-200 p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto text-earth-500">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-earth-900">
                Nenhum produto encontrado
              </h3>
              <p className="text-sm text-earth-600 max-w-sm mx-auto font-light">
                Não encontramos nenhuma peça com esses filtros. Tente buscar por outro termo ou selecionar outra categoria.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2 rounded-full bg-earth-800 hover:bg-earth-900 text-cream-50 text-xs font-medium transition-colors"
                >
                  Ver Todos os Produtos
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={handleOpenDetails}
                  onQuickAdd={(p) => addItem(p, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção Sobre Nós */}
      <AboutSection />

      {/* Seção de Contato */}
      <ContactSection settings={settings} />

      {/* Rodapé */}
      <Footer settings={settings} onNavigateToAdmin={onNavigateToAdmin} />

      {/* Modais e Gavetas da Loja */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <CartDrawer />

      <WhatsAppCheckoutModal
        isOpen={useCart().isCheckoutOpen}
        onClose={useCart().closeCheckout}
        settings={settings}
      />
    </div>
  );
}
