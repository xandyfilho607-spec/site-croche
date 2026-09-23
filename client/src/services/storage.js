const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/csusxfdh/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'produtos';

/**
 * Faz upload direto da imagem para o Cloudinary usando um preset unsigned
 * @param {File} file - Arquivo de imagem selecionado pelo usuário
 * @param {Function} onProgress - Callback com a porcentagem de progresso (0 a 100)
 * @returns {Promise<string>} URL segura da imagem
 */
export async function uploadProductImage(file, onProgress) {
  if (!file) {
    throw new Error('Nenhum arquivo de imagem foi selecionado.');
  }

  onProgress?.(0);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  let response;
  try {
    response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    throw new Error('Falha ao conectar ao Cloudinary para enviar a imagem.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    // Mantém uma mensagem controlada quando o serviço não retorna JSON.
  }

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || 'Não foi possível obter a URL da imagem no Cloudinary.');
  }

  onProgress?.(100);
  return data.secure_url;
}
