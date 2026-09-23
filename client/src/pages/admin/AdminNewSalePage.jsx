import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Check,
  ShoppingBag,
  User,
  FileText,
  DollarSign,
  AlertCircle,
  Package,
} from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export function AdminNewSalePage({ onSaleRegistered }) {
  const toast = useToast();

  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Campos da Venda
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [saleItems, setSaleItems] = useState([
    { productId: '', name: '', price: '', quantity: 1, subtotal: 0 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.getProducts();
        setAvailableProducts(res?.data || []);
      } catch (err) {
        console.error('Erro ao carregar lista de produtos:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  // Adicionar linha de item
  const handleAddItem = () => {
    setSaleItems((prev) => [
      ...prev,
      { productId: '', name: '', price: '', quantity: 1, subtotal: 0 },
    ]);
  };

  // Remover linha de item
  const handleRemoveItem = (index) => {
    if (saleItems.length <= 1) {
      toast.warning('A venda deve conter ao menos um produto.');
      return;
    }
    setSaleItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Selecionar produto existente do catálogo do Neon
  const handleSelectProduct = (index, productId) => {
    const found = availableProducts.find((p) => String(p.id) === String(productId));
    setSaleItems((prev) => {
      const updated = [...prev];
      if (found) {
        const price = parseFloat(found.price) || 0;
        const qty = updated[index].quantity || 1;
        updated[index] = {
          productId: found.id,
          name: found.name,
          price: price,
          quantity: qty,
          subtotal: price * qty,
        };
      } else {
        // Opção de item avulso/customizado
        updated[index] = {
          ...updated[index],
          productId: '',
        };
      }
      return updated;
    });
  };

  // Atualizar campo específico da linha do item
  const handleItemFieldChange = (index, field, value) => {
    setSaleItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity, 10) || 1;
      item.subtotal = price * qty;

      updated[index] = item;
      return updated;
    });
  };

  // Total da Venda
  const total = saleItems.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!customerName.trim()) {
      newErrors.customerName = 'Informe o nome do cliente que comprou no WhatsApp.';
    }

    const invalidItems = saleItems.some(
      (item) => !item.name.trim() || parseFloat(item.price) <= 0 || item.quantity <= 0
    );

    if (invalidItems) {
      newErrors.items = 'Preencha o nome, quantidade e preço válido para todos os itens.';
    }

    if (total <= 0) {
      newErrors.total = 'O total da venda deve ser maior que zero.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName.trim(),
        items: saleItems.map((item) => ({
          productId: item.productId || null,
          name: item.name.trim(),
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity, 10),
          subtotal: parseFloat(item.subtotal),
        })),
        total,
        notes: notes.trim() || null,
      };

      await api.createSale(payload);
      toast.success('Venda confirmada e salva com sucesso no Neon!');

      // Limpar formulário
      setCustomerName('');
      setNotes('');
      setSaleItems([{ productId: '', name: '', price: '', quantity: 1, subtotal: 0 }]);

      if (onSaleRegistered) {
        onSaleRegistered();
      }
    } catch (err) {
      console.error('Erro ao registrar venda:', err);
      toast.error(err.message || 'Erro ao registrar venda no banco.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Topo */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
          Registrar Venda Confirmada
        </h1>
        <p className="text-xs text-earth-600 font-light mt-0.5">
          Registre aqui a venda após combinar e confirmar os detalhes e o pagamento com a cliente pelo WhatsApp.
        </p>
      </div>

      {/* Formulário de Registro */}
      <form onSubmit={handleSubmit} className="bg-cream-50 rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6">
        {/* Identificação da Cliente */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1.5">
            Nome da Cliente <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-earth-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: null }));
              }}
              placeholder="Ex: Mariana Albuquerque"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-200"
            />
          </div>
          {errors.customerName && (
            <p className="text-xs text-rose-600 mt-1">{errors.customerName}</p>
          )}
        </div>

        {/* Lista de Itens da Venda */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800">
              Produtos Vendidos <span className="text-rose-600">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-xs font-medium text-sage-700 hover:text-sage-900"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Adicionar outro produto</span>
            </button>
          </div>

          <div className="space-y-3">
            {saleItems.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-cream-100/50 border border-cream-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
              >
                {/* Seletor Rápido do Catálogo */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] text-earth-600 mb-1">
                    Selecionar do Catálogo
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleSelectProduct(index, e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 bg-white text-earth-900 focus:outline-none focus:border-sage-500"
                  >
                    <option value="">-- Personalizado / Avulso --</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatCurrency(p.price)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nome do Item */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-earth-600 mb-1">
                    Nome do Item <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={item.name}
                    onChange={(e) => handleItemFieldChange(index, 'name', e.target.value)}
                    placeholder="Ex: Bolsa Floral"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 bg-white text-earth-900 focus:outline-none focus:border-sage-500"
                  />
                </div>

                {/* Preço Unitário */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-earth-600 mb-1">
                    Preço Unit. (R$) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={item.price}
                    onChange={(e) => handleItemFieldChange(index, 'price', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 bg-white text-earth-900 focus:outline-none focus:border-sage-500"
                  />
                </div>

                {/* Quantidade */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] text-earth-600 mb-1">
                    Qtd
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemFieldChange(index, 'quantity', e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-cream-300 bg-white text-earth-900 text-center focus:outline-none focus:border-sage-500"
                  />
                </div>

                {/* Subtotal e Remover */}
                <div className="sm:col-span-2 flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] text-earth-500">Subtotal</span>
                    <span className="font-serif text-xs font-bold text-earth-900">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 rounded-lg text-earth-400 hover:text-rose-600 hover:bg-cream-200 transition-colors"
                    title="Remover linha"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {errors.items && <p className="text-xs text-rose-600">{errors.items}</p>}
        </div>

        {/* Observações da Venda */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1.5">
            Observações / Combinações do WhatsApp <span className="text-earth-400 font-normal lowercase">(opcional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Pagamento via Pix realizado, combinar entrega no sábado na estação..."
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500 resize-none"
          />
        </div>

        {/* Resumo Financeiro & Envio */}
        <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-earth-500 block">Total a Registrar no Faturamento:</span>
            <span className="font-serif text-3xl font-bold text-earth-900">
              {formatCurrency(total)}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-earth-800 hover:bg-earth-900 text-cream-50 text-sm font-medium shadow-soft hover:shadow-card transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Salvando no Neon...' : 'Confirmar e Salvar Venda'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
