import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login de administrador
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return userCredential.user;
    } catch (error) {
      let friendlyMessage = 'Erro ao realizar login. Verifique seus dados.';
      if (
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/invalid-credential'
      ) {
        friendlyMessage = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/invalid-email') {
        friendlyMessage = 'Formato de e-mail inválido.';
      } else if (error.code === 'auth/too-many-requests') {
        friendlyMessage = 'Muitas tentativas sem sucesso. Aguarde alguns minutos antes de tentar novamente.';
      }
      throw new Error(friendlyMessage);
    }
  };

  // Logout de administrador
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
      throw new Error('Falha ao encerrar a sessão.');
    }
  };

  // Recuperação de senha
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      throw new Error('Não foi possível enviar o e-mail de recuperação.');
    }
  };

  const value = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
