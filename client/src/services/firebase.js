import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase fornecida pelo cliente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDFV-qUtuP185gCyBLiUMeTqX_bsWRMOI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alteticacaocrochermaressa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alteticacaocrochermaressa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alteticacaocrochermaressa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "906890491343",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:906890491343:web:d4a62e66c7dcf05e0a8eba",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4635PD08LZ",
};

// Inicialização do Firebase App
export const app = initializeApp(firebaseConfig);

// Inicialização do Firebase Authentication (somente para o administrador)
export const auth = getAuth(app);

