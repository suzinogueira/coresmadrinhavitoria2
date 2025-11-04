import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function MadrinhaPage() {
  const router = useRouter();
  const { token, color } = router.query;
  const [madrinha, setMadrinha] = useState(null);

  useEffect(() => {
    if (!token) return;
    const name = atob(token);

    // Primeiro tenta ler do sorteio público via API
    const loadPublic = async () => {
      try {
        const res = await fetch('/api/get-sorteio');
        const data = await res.json();
        if (data && data[name]) {
          setMadrinha({ name, color: data[name].color, rgb: data[name].rgb });
          return;
        }
      } catch (e) { /* ignore */ }

      // fallback: se veio color no query (quando gerado no painel), usa ele
      if (color) {
        // color here is name like "Azul Serenity" — map to rgb via local map
        const colorMap = {
          "Verde Esmeralda": "rgb(80, 200, 120)",
          "Azul Serenity": "rgb(130, 180, 240)",
          "Lilás": "rgb(200, 160, 240)",
          "Rosa Pink": "rgb(255, 100, 180)",
          "Amarelo": "rgb(255, 230, 50)",
          "Roxo Ametista": "rgb(150, 100, 200)",
          "Terracota": "rgb(210, 120, 80)",
          "Azul Royal": "rgb(30, 60, 200)",
          "Azul Marinho": "rgb(10, 20, 80)",
          "Verde Água": "rgb(120, 240, 200)",
        };
        setMadrinha({ name, color, rgb: colorMap[color] || 'rgb(230,230,230)' });
      } else {
        setMadrinha({ name, color: 'Cor não encontrada', rgb: 'rgb(230,230,230)' });
      }
    };

    loadPublic();
  }, [token, color]);

  if (!madrinha) return null;

  return (
    <div style={{ minHeight: '100vh', background: madrinha.rgb, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'rgba(0,0,0,0.35)', color: '#fff', borderRadius: 16, padding: 28, textAlign: 'center', maxWidth: 520 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>💌 Sua cor sorteada foi:</h1>
        <p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0' }}>{madrinha.color}</p>
        <p style={{ marginTop: 6, fontSize: 18 }}><strong>{madrinha.name}</strong></p>
        <div style={{ marginTop: 10, fontSize: 16 }}>Vitória e Felipe 2026 💍</div>
      </div>
    </div>
  );
}
