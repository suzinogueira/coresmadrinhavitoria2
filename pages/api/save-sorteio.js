// pages/api/save-sorteio.js
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
  const GITHUB_REPO = process.env.GITHUB_REPO; // Ex: "seuusuario/seurepositorio"
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).send("Falta configurar GITHUB_TOKEN ou GITHUB_REPO");
  }

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/sorteio.json`;

    // Verifica se o arquivo já existe
    const getResp = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let sha = null;
    if (getResp.ok) {
      const json = await getResp.json();
      sha = json.sha; // se existir, usa o mesmo arquivo
    }

    // Codifica o conteúdo em base64
    const contentEncoded = Buffer.from(
      JSON.stringify(sorteio, null, 2)
    ).toString("base64");

    // Cria ou atualiza o arquivo no GitHub
    const saveResp = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: "Atualizar sorteio público",
        content: contentEncoded,
        branch: GITHUB_BRANCH,
        sha,
      }),
    });

    if (!saveResp.ok) {
      const txt = await saveResp.text();
      return res.status(500).send("Erro ao salvar no GitHub: " + txt);
    }

    return res.status(200).send("Sorteio salvo com sucesso no GitHub!");
  } catch (err) {
    console.error("Erro ao salvar sorteio:", err);
    return res.status(500).send("Erro interno: " + err.message);
  }
}
