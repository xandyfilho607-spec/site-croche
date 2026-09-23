import { formatCurrency } from './formatters';

/**
 * Monta o texto padronizado do pedido e gera a URL de envio direto para o WhatsApp
 * @param {object} params
 * @param {string} params.customerName - Nome do cliente
 * @param {Array} params.items - Array de itens [{ name, quantity, price, subtotal }]
 * @param {number} params.total - Valor total do pedido
 * @param {string} [params.notes] - Observação opcional do cliente
 * @param {string} params.phone - Número do WhatsApp da proprietária
 * @returns {string} URL completa wa.me
 */
export function generateWhatsAppOrderUrl({ customerName, items, total, notes, phone }) {
  const storePhone = String(phone || '5511999999999').replace(/\D/g, '');

  const itemsLines = items
    .map((item) => `• ${item.name} — ${item.quantity}x — ${formatCurrency(item.price)}`)
    .join('\n');

  let message = `*Novo pedido — Mereça Crochê*\n\n`;
  message += `Cliente: ${customerName.trim()}\n\n`;
  message += `Produtos:\n${itemsLines}\n\n`;
  message += `Total: ${formatCurrency(total)}`;

  if (notes && notes.trim()) {
    message += `\n\nObservação:\n${notes.trim()}`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${storePhone}?text=${encodedMessage}`;
}
