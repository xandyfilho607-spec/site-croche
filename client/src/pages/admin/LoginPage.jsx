import React, { useState } from 'react';
import { Lock, Mail, Sparkles, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function LoginPage({ onBackToShop, onLoginSuccess }) {
  const { login, resetPassword } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Preencha seu e-mail e sua senha de administradora.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login efetuado com sucesso!');
      onLoginSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Falha na autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Digite seu e-mail para receber o link de redefinição de senha.');
      return;
    }

    try {
      setIsResetting(true);
      await resetPassword(email);
      toast.info('Instruções de redefinição de senha enviadas para seu e-mail!');
    } catch (err) {
      toast.error(err.message || 'Erro ao solicitar redefinição.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Botão de Retorno */}
        <div className="mb-6">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-xs font-medium text-earth-600 hover:text-earth-900 transition-colors p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Loja Virtual</span>
          </button>
        </div>

        {/* Card de Login */}
        <div className="bg-cream-50 rounded-3xl shadow-elevated border border-cream-200/90 p-8 sm:p-10">
          {/* Logo e Cabeçalho */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-earth-800 text-gold-400 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
                Mereça Crochê
              </h1>
              <p className="text-xs uppercase tracking-widest text-sage-600 font-semibold mt-1">
                Acesso Administrativo
              </p>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1.5">
                E-mail da Administradora
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-earth-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="admin@merecacroche.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-earth-800">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="text-[11px] text-sage-700 hover:text-sage-900 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-earth-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-earth-800 hover:bg-earth-900 text-cream-50 font-medium text-sm transition-all duration-200 shadow-soft hover:shadow-card active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Entrando no painel...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Acessar Painel</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-cream-200 text-center">
            <p className="text-[11px] text-earth-500 font-light">
              Autenticação protegida via Firebase Authentication. Acesso restrito apenas à proprietária.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
