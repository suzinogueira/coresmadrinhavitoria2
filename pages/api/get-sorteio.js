// pages/api/get-sorteio.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const GITHUB_REPO = process.env.GITHUB_REPO; // user/repo
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
    if (!GITHUB_REPO) return res.status(200).json({});
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/public/sorteio.json`;
    const r = await fetch(rawUrl);
    if (!r.ok) return res.status(200).json({});
    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(200).json({});
  }
}
