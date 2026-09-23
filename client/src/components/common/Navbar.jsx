import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Menu, X, Shield, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ settings, onNavigateToAdmin }) {
  const { totalItems, openCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const storeName = settings?.store_name || 'Mereça Crochê';
  const whatsappNum = settings?.whatsapp_number || '5511999999999';
  const whatsappLink = `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Olá! Estava navegando na loja Mereça Crochê e gostaria de tirar uma dúvida.')}`;

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Categorias', href: '#categorias' },
    { label: 'Destaques', href: '#destaques' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Marca */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-cream-200/80 border border-gold-400/40 flex items-center justify-center text-earth-700 shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-gold-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-earth-900 group-hover:text-earth-700 transition-colors">
                {storeName}
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-sage-600">
                Crochê Artesanal
              </span>
            </div>
          </a>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-earth-700 hover:text-earth-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sage-500 hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Ações Direitas: WhatsApp, Carrinho, Admin */}
          <div className="flex items-center gap-3">
            {/* Botão de WhatsApp */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70 hover:bg-emerald-100/80 transition-all shadow-sm"
              title="Fale conosco no WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Atalho Admin se logado */}
            {isAuthenticated && (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-cream-200 text-earth-800 hover:bg-cream-300 transition-colors"
                title="Ir para o Painel Administrativo"
              >
                <Shield className="w-3.5 h-3.5 text-sage-700" />
                <span className="hidden sm:inline">Painel</span>
              </button>
            )}

            {/* Botão de Carrinho */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-earth-800 bg-cream-100 hover:bg-cream-200 border border-cream-300 transition-all shadow-soft flex items-center justify-center group"
              aria-label="Ver carrinho de compras"
            >
              <ShoppingBag className="w-5 h-5 text-earth-700 group-hover:text-earth-950 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-earth-800 text-cream-50 text-xs font-bold rounded-full flex items-center justify-center border-2 border-cream-50 animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Botão Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-earth-700 hover:text-earth-950 hover:bg-cream-200/60 transition-colors"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Gaveta Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-cream-50 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-card">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-2 rounded-lg text-base font-medium text-earth-800 hover:bg-cream-200/70 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-cream-200 flex flex-col gap-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar no WhatsApp</span>
            </a>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium text-earth-600 hover:bg-cream-200/60"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Acesso Administrativo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
