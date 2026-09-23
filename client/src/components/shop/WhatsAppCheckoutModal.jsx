import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';

export function WhatsAppCheckoutModal({ isOpen, onClose, settings }) {
  const { items, total, clearCart } = useCart();
  const toast = useToast();

  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState('');

  const storePhone = settings?.whatsapp_number || '5511999999999';

  const handleSendOrder = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setNameError('Por favor, informe seu nome para que possamos identificá-lo.');
      return;
    }
    setNameError('');

    if (items.length === 0) {
      toast.warning('Sua sacola está vazia.');
      onClose();
      return;
    }

    // 1. Gera a URL oficial formatada para o wa.me
    const waUrl = generateWhatsAppOrderUrl({
      customerName: customerName.trim(),
      items,
      total,
      notes: notes.trim(),
      phone: storePhone,
    });

    // 2. Abre a conversa no WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // 3. Notifica o usuário e limpa o carrinho local
    toast.success('Pedido enviado para o WhatsApp! Aguarde o contato da proprietária.');
    clearCart();
    setCustomerName('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Finalizar Pedido pelo WhatsApp"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSendOrder} className="space-y-6">
        {/* Aviso Explicativo Amigável */}
        <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200 text-xs text-sage-800 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Seu pedido será enviado diretamente para a conversa da artesã no WhatsApp. A confirmação de disponibilidade, cores e frete será combinada com você!
          </p>
        </div>

        {/* Resumo Completo dos Produtos */}
        <div>
          <h4 className="font-serif text-sm font-semibold text-earth-900 mb-2">
            Resumo dos Itens Selecionados
          </h4>
          <div className="border border-cream-200 rounded-xl overflow-hidden bg-cream-100/40">
            <div className="max-h-48 overflow-y-auto divide-y divide-cream-200/80">
              <table className="min-w-full divide-y divide-cream-200 text-xs">
                <thead className="bg-cream-200/60 text-earth-700 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left">Produto</th>
                    <th scope="col" className="px-2 py-2 text-center">Qtd</th>
                    <th scope="col" className="px-3 py-2 text-right">Preço</th>
                    <th scope="col" className="px-3 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200/60 bg-cream-50/50">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2.5 font-medium text-earth-900">
                        {item.name}
                      </td>
                      <td className="px-2 py-2.5 text-center text-earth-700">
                        {item.quantity}x
                      </td>
                      <td className="px-3 py-2.5 text-right text-earth-600">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-earth-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totalizador */}
            <div className="p-3.5 bg-cream-200/60 border-t border-cream-200 flex items-baseline justify-between">
              <span className="font-serif text-sm font-semibold text-earth-900">
                Total do Pedido:
              </span>
              <span className="font-serif text-xl font-bold text-earth-900">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Campos de Entrada: Nome e Observação */}
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="customerName"
              className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1"
            >
              Seu Nome completo <span className="text-rose-600">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="Ex: Maria Santos"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-cream-50 focus:outline-none focus:ring-2 transition-all ${
                nameError 
                  ? 'border-rose-400 focus:ring-rose-200 text-rose-900' 
                  : 'border-cream-300 focus:border-sage-500 focus:ring-sage-200 text-earth-900'
              }`}
            />
            {nameError && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label 
              htmlFor="orderNotes"
              className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1"
            >
              Observação <span className="text-earth-400 font-normal lowercase">(opcional)</span>
            </label>
            <textarea
              id="orderNotes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Gostaria na cor cru com detalhes em verde sálvia, entregar no período da tarde..."
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm text-earth-900 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all resize-none"
            />
          </div>
        </div>

        {/* Botão de Enviar pelo WhatsApp */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-soft hover:shadow-card active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Enviar pedido pelo WhatsApp</span>
          </button>
          <p className="text-[11px] text-center text-earth-500 mt-2">
            Ao clicar, o WhatsApp da loja será aberto com a sua mensagem pronta para envio.
          </p>
        </div>
      </form>
    </Modal>
  );
}
