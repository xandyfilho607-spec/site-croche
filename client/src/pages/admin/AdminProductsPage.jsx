import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle,
  XCircle,
  RefreshCw,
  Package,
} from 'lucide-react';
import { api } from '../../services/api';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { ProductImage } from '../../components/common/ProductImage';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export function AdminProductsPage() {
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal de formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(prodsRes?.data || []);
      setCategories(catsRes?.data || []);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      toast.error('Erro ao carregar produtos do banco Neon.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (payload) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        toast.success('Produto atualizado com sucesso no Neon!');
      } else {
        await api.createProduct(payload);
        toast.success('Produto adicionado ao catálogo com sucesso!');
      }
      loadData();
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar produto.');
      throw err;
    }
  };

  const handleToggleStatus = async (product, field) => {
    try {
      const updatedValue = !product[field];
      await api.toggleProductStatus(product.id, { [field]: updatedValue });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, [field]: updatedValue } : p
        )
      );

      if (field === 'available') {
        toast.info(updatedValue ? `"${product.name}" marcado como disponível.` : `"${product.name}" marcado como esgotado.`);
      } else if (field === 'featured') {
        toast.info(updatedValue ? `"${product.name}" adicionado aos destaques.` : `"${product.name}" removido dos destaques.`);
      }
    } catch (err) {
      toast.error('Não foi possível alterar o status do produto.');
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"? Esta ação removerá a peça do catálogo.`)) {
      try {
        await api.deleteProduct(product.id);
        toast.success(`"${product.name}" excluído com sucesso.`);
        loadData();
      } catch (err) {
        toast.error(err.message || 'Erro ao excluir o produto.');
      }
    }
  };

  // Filtragem
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase().trim()));

    const matchesCategory =
      !categoryFilter || String(p.category_id) === String(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Gerenciar Produtos
          </h1>
          <p className="text-xs text-earth-600 font-light mt-0.5">
            Cadastre peças de crochê, suba imagens no Cloudinary e atualize preços no Neon.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-200 text-earth-700 transition-colors"
            title="Recarregar produtos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth-800 hover:bg-earth-900 text-cream-50 text-xs font-medium shadow-soft transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Produto</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-white text-earth-900 focus:outline-none focus:border-sage-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-cream-300 bg-white text-earth-800 focus:outline-none focus:border-sage-500"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conteúdo Principal (Tabela Desktop / Cards Mobile) */}
      {loading ? (
        <div className="py-24">
          <LoadingSpinner size="lg" text="Carregando produtos do Neon..." />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-cream-50 rounded-2xl border border-cream-200 p-8 space-y-3">
          <Package className="w-12 h-12 text-earth-400 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-earth-900">
            Nenhum produto cadastrado com esses critérios
          </h3>
          <p className="text-xs text-earth-600 font-light max-w-sm mx-auto">
            Clique no botão acima para adicionar sua primeira peça artesanal de crochê.
          </p>
        </div>
      ) : (
        <div className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cream-200 text-xs">
              <thead className="bg-cream-100 text-earth-700 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left">Foto</th>
                  <th scope="col" className="px-4 py-3.5 text-left">Nome da Peça</th>
                  <th scope="col" className="px-4 py-3.5 text-left">Categoria</th>
                  <th scope="col" className="px-4 py-3.5 text-left">Preço</th>
                  <th scope="col" className="px-4 py-3.5 text-center">Status</th>
                  <th scope="col" className="px-4 py-3.5 text-center">Destaque</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200/80 bg-cream-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-100/40 transition-colors">
                    {/* Foto */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-200 border border-cream-300 flex-shrink-0">
                        <ProductImage
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full"
                        />
                      </div>
                    </td>

                    {/* Nome & Descrição curta */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-earth-900 line-clamp-1 max-w-xs font-serif text-sm">
                        {product.name}
                      </div>
                      <span className="text-[11px] text-earth-500 line-clamp-1 font-light max-w-xs">
                        {product.description || 'Sem descrição cadastrada'}
                      </span>
                    </td>

                    {/* Categoria */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-cream-200 text-earth-800 text-[11px] font-medium">
                        {product.category_name || 'Sem categoria'}
                      </span>
                    </td>

                    {/* Preço */}
                    <td className="px-4 py-3 whitespace-nowrap font-serif font-bold text-earth-900 text-sm">
                      {formatCurrency(product.price)}
                    </td>

                    {/* Status Disponível / Esgotado com Switch Rápido */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(product, 'available')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          product.available !== false
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Clique para alternar disponível/esgotado"
                      >
                        {product.available !== false ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Disponível</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Esgotado</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Destaque */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(product, 'featured')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.featured
                            ? 'text-gold-600 bg-amber-50 hover:bg-amber-100'
                            : 'text-earth-400 hover:text-gold-600 hover:bg-cream-200'
                        }`}
                        title={product.featured ? 'Remover dos destaques' : 'Marcar como destaque'}
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    {/* Ações: Editar e Excluir */}
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 rounded-lg text-earth-600 hover:text-earth-950 hover:bg-cream-200 transition-colors"
                          title="Editar produto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Formulário */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
