import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante o carregamento correto do .env independente de onde o processo for iniciado
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// -------------------------------------------------------
// Firebase Admin SDK — Inicialização única (ES Modules)
// -------------------------------------------------------
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'alteticacaocrochermaressa';
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

// Verifica se as credenciais completas de Service Account foram configuradas
const hasFullServiceAccount = 
  clientEmail && 
  rawPrivateKey && 
  !clientEmail.includes('COLE_AQUI') && 
  !rawPrivateKey.includes('COLE_AQUI');

if (!getApps().length) {
  if (hasFullServiceAccount) {
    // Converte \\n (vindos do .env) para quebras de linha reais
    const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log(`🔐 Firebase Admin SDK inicializado com credencial Service Account (${projectId})`);
  } else {
    // Inicialização direta com projectId para validação pública de ID Tokens (verifyIdToken)
    initializeApp({
      projectId,
    });
    console.log(`🔐 Firebase Admin SDK inicializado para verificação de tokens (Projeto: ${projectId})`);
  }
}

/**
 * Valida o Firebase ID Token enviado no header Authorization.
 * Usa o Firebase Admin SDK para verificação criptográfica do token.
 *
 * @param {string} token - Firebase ID Token JWT
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>} payload decodificado
 */
export async function verifyFirebaseToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token de autenticação não fornecido.');
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken;
  } catch (err) {
    const errorCode = err.code || 'auth/invalid-token';
    console.error(`❌ Falha na validação do token Firebase: [${errorCode}]`);
    throw new Error('Token inválido ou expirado.');
  }
}
