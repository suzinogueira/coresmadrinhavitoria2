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
     <div
      style={{
        minHeight: "100vh",
        background: madrinha.rgb,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          borderRadius: "16px",
          padding: "30px 40px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          maxWidth: "90%",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
          💌 Sua cor sorteada foi:
        </h1>
        <p style={{ fontSize: "1.4rem", marginBottom: "20px" }}>
          <strong>{madrinha.name}</strong>, a cor do seu vestido será{" "}
          <span style={{ textDecoration: "underline" }}>
            {madrinha.color}
          </span>
          !
        </p>
        <h2 style={{ fontWeight: 500, fontSize: "1.2rem" }}>
          Vitória e Felipe 💍 2026
        </h2>
      </div>
    </div>
  );
}
