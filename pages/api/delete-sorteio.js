/*// pages/api/delete-sorteio.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_REPO) return res.status(500).end('Falta configurar GITHUB_TOKEN ou GITHUB_REPO');

  try {
    const path = 'public/sorteio.json';
    const apiBase = 'https://api.github.com';
    const getUrl = `${apiBase}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}?ref=${GITHUB_BRANCH}`;
    const getRes = await fetch(getUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'sorteio-app' }
    });

    if (getRes.status !== 200) {
      return res.status(404).send('Arquivo não encontrado');
    }
    const getData = await getRes.json();
    const sha = getData.sha;

    const deleteUrl = `${apiBase}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}`;
    const body = { message: 'Remove sorteio madrinhas', sha, branch: GITHUB_BRANCH };

    const delRes = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'sorteio-app', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!delRes.ok) {
      const text = await delRes.text();
      console.error('GitHub delete error', text);
      return res.status(500).send('Erro ao deletar no GitHub: ' + text);
    }

    return res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro interno');
  }
}*/

// pages/api/delete-sorteio.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).end("Método não permitido");

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // ex: suzinogueira/coresmadrinhavitoria
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
  const path = "public/sorteio.json";
  const apiBase = "https://api.github.com";

  if (!GITHUB_TOKEN || !GITHUB_REPO)
    return res
      .status(500)
      .send("Falta configurar GITHUB_TOKEN ou GITHUB_REPO");

  try {
    // 1️⃣ Primeiro pega o SHA do arquivo (obrigatório para deletar)
    const getUrl = `${apiBase}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(
      path
    )}?ref=${GITHUB_BRANCH}`;

    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "sorteio-app",
      },
    });

    if (getRes.status === 404) {
      return res.status(404).send("Arquivo não encontrado");
    }

    const getData = await getRes.json();
    const sha = getData.sha;

    // 2️⃣ Agora faz o DELETE
    const deleteUrl = `${apiBase}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(
      path
    )}`;

    const deleteRes = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "sorteio-app",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "

