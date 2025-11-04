/*// pages/api/get-sorteio.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const GITHUB_REPO = process.env.GITHUB_REPO; // ex: usuario/repositorio
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

    if (!GITHUB_REPO) {
      console.warn("Variável GITHUB_REPO não configurada.");
      return res.status(200).json({
        madrinhas: [],
        cores: [],
        resultado: [],
        criadoEm: new Date().toISOString(),
      });
    }

    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/public/sorteio.json`;
    const response = await fetch(rawUrl);

    if (!response.ok) {
      // Se o arquivo não existir ainda, retorna um padrão vazio
      return res.status(200).json({
        madrinhas: [],
        cores: [],
        resultado: [],
        criadoEm: new Date().toISOString(),
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao carregar sorteio público:", err);
    return res.status(200).json({
      madrinhas: [],
      cores: [],
      resultado: [],
      criadoEm: new Date().toISOString(),
    });
  }
}*/

// pages/api/get-sorteio.js
export default async function handler(req, res) {
  try {
    const GITHUB_REPO = process.env.GITHUB_REPO; // Exemplo: "suzi123/meu-repo"
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    if (!GITHUB_REPO) {
      console.warn('⚠️ Variável GITHUB_REPO não configurada');
      return res.status(200).json({ sorteioPublico: null });
    }

    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/public/sorteio.json`;

    const response = await fetch(rawUrl);
    if (!response.ok) {
      console.log(`ℹ️ Nenhum sorteio público encontrado (status: ${response.status})`);
      return res.status(200).json({ sorteioPublico: null });
    }

    const data = await response.json();
    return res.status(200).json({ sorteioPublico: data });

  } catch (err) {
    console.error('❌ Erro ao buscar sorteio público:', err);
    return res.status(200).json({ sorteioPublico: null });
  }
}

