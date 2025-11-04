/*// pages/api/save-sorteio.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');
  const { sorteio } = req.body;
  if (!sorteio) return res.status(400).end('Falta o sorteio');

//  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
 // const GITHUB_REPO = process.env.GITHUB_REPO; // ex: user/repo
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

 // if (!GITHUB_TOKEN || !GITHUB_REPO) return res.status(500).end('Falta configurar GITHUB_TOKEN ou GITHUB_REPO');
export default function handler(req, res) {
  return res.status(200).json({ message: "Sorteio salvo com sucesso!" });
}


  try {
    const path = 'public/sorteio.json';
    const apiBase = 'https://api.github.com';
    // 1) pegar o SHA do arquivo (se existir)
    const getUrl = `${apiBase}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}?ref=${GITHUB_BRANCH}`;
    const getRes = await fetch(getUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'sorteio-app' }
    });

    let sha = null;
    if (getRes.status === 200) {
      const getData = await getRes.json();
      sha = getData.sha;
    }

    // 2) preparar conteúdo base64
    const content = Buffer.from(JSON.stringify(sorteio, null, 2)).toString('base64');

    // 3) criar/atualizar arquivo
    const putUrl = `${apiBase}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}`;
    const body = {
      message: 'Atualiza sorteio madrinhas',
      content,
      branch: GITHUB_BRANCH
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'sorteio-app', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const text = await putRes.text();
      console.error('GitHub put error', text);
      return res.status(500).send('Erro ao salvar no GitHub: ' + text);
    }

    return res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro interno');
  }
}*/

// pages/api/save-sorteio.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { sorteio } = req.body;

  if (!sorteio) {
    return res.status(400).json({ message: 'Nenhum sorteio recebido' });
  }

  // Simulação de salvamento (sem GitHub, apenas confirma que deu certo)
  console.log('Sorteio recebido:', sorteio);

  return res.status(200).json({ message: 'Sorteio salvo com sucesso (simulado)' });
}

