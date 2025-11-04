// pages/api/get-sorteio.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // lê o arquivo público (existente no repo): public/sorteio.json
    const p = path.join(process.cwd(), 'public', 'sorteio.json');
    if (!fs.existsSync(p)) {
      return res.status(200).json({});
    }
    const raw = fs.readFileSync(p, 'utf8');
    const data = JSON.parse(raw || '{}');
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro ao ler sorteio');
  }
}
