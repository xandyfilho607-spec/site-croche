import { verifyFirebaseToken } from '../config/firebase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Acesso não autorizado. Faça login para continuar.',
      });
    }

    const token = authHeader.split(' ')[1];
    const userPayload = await verifyFirebaseToken(token);

    req.user = userPayload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Sessão inválida ou expirada. Por favor, autentique-se novamente.',
    });
  }
}
