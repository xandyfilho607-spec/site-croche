/**
 * Formata um valor numérico para Moeda Brasileira (R$)
 * @param {number|string} value 
 * @returns {string} Ex: "R$ 85,00"
 */
export function formatCurrency(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

/**
 * Formata data e hora para o padrão pt-BR
 * @param {string|Date} date 
 * @param {boolean} includeTime 
 * @returns {string} Ex: "17/09/2026 às 14:30"
 */
export function formatDate(date, includeTime = true) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const datePart = d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (!includeTime) return datePart;

  const timePart = d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart} às ${timePart}`;
}

/**
 * Formata número de telefone para padrão (XX) XXXXX-XXXX
 * @param {string} phone 
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  }
  return phone;
}
