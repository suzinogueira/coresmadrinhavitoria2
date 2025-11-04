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

/*2
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

*/

import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { sorteio } = req.body;
  if (!sorteio) {
    return res.status(400).json({ message: "Nenhum sorteio recebido" });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // Exemplo: suzinogueira/coresmadrinhavitoria
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ message: "Faltam variáveis de ambiente" });
  }

  try {
    const filePath = "public/sorteio.json";

    // Busca o SHA atual (para editar caso o arquivo já exista)
    const fileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    let sha = null;
    if (fileResponse.ok) {
      const fileData = await fileResponse.json();
      sha = fileData.sha;
    }

    // Monta o conteúdo em base64
    const content = Buffer.from(JSON.stringify(sorteio, null, 2)).toString("base64");

    // Cria ou atualiza o arquivo
    const saveResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Atualiza sorteio público",
          content,
          sha,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    if (!saveResponse.ok) {
      const errorData = await saveResponse.json();
      console.error("Erro ao salvar:", errorData);
      return res.status(500).json({ message: "Erro ao salvar no repositório", errorData });
    }

    return res.status(200).json({ message: "Sorteio salvo com sucesso!" });
  } catch (error) {
    console.error("Erro geral ao salvar:", error);
    return res.status(500).json({ message: "Erro interno", error });
  }
}
