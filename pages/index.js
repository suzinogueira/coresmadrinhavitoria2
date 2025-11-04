import { useState, useEffect } from "react";
import { saveAs } from "file-saver";

const PASSWORD = "vitoria";

const colors = [
  { name: "Verde Esmeralda", rgb: "rgb(80, 200, 120)" },
  { name: "Azul Serenity", rgb: "rgb(130, 180, 240)" },
  { name: "Lilás", rgb: "rgb(200, 160, 240)" },
  { name: "Rosa Pink", rgb: "rgb(255, 100, 180)" },
  { name: "Amarelo", rgb: "rgb(255, 230, 50)" },
  { name: "Roxo Ametista", rgb: "rgb(150, 100, 200)" },
  { name: "Terracota", rgb: "rgb(210, 120, 80)" },
  { name: "Azul Royal", rgb: "rgb(30, 60, 200)" },
  { name: "Azul Marinho", rgb: "rgb(10, 20, 80)" },
  { name: "Verde Água", rgb: "rgb(120, 240, 200)" },
];

const madrinhasLista = [
  "Nelzi", "Aldri", "Kátia", "Gracieli", "Ana Beatriz",
  "Elisângela", "Eduarda", "Ketlin", "Jamile", "Simone",
  "Sara", "Guiomar", "Thalyta", "Rebeca", "Bruna",
  "Daniela", "Graziele", "Leni", "Almira", "Kelly"
];

export default function Admin() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar sorteio existente do GitHub
  useEffect(() => {
    fetch("/api/get-sorteio")
      .then(res => res.ok ? res.json() : [])
      .then(data => setResults(data || []))
      .catch(() => {});
  }, []);

  // Função para gerar novo sorteio
  const embaralharEGerar = async () => {
    const shuffled = [...madrinhasLista].sort(() => Math.random() - 0.5);
    const pairs = [];
    for (let i = 0; i < colors.length; i++) {
      pairs.push({
        madrinha1: shuffled[i * 2],
        madrinha2: shuffled[i * 2 + 1],
        color: colors[i]
      });
    }
    const links = [];
    pairs.forEach(p => {
      links.push({ name: p.madrinha1, color: p.color.name, rgb: p.color.rgb, token: btoa(p.madrinha1) });
      links.push({ name: p.madrinha2, color: p.color.name, rgb: p.color.rgb, token: btoa(p.madrinha2) });
    });
    setResults(links);

    setLoading(true);
    await fetch("/api/save-sorteio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sorteio: links }),
    });
    setLoading(false);
  };

  // Apagar sorteio
  const apagarSorteio = async () => {
    setLoading(true);
    await fetch("/api/delete-sorteio", { method: "DELETE" });
    setResults([]);
    setLoading(false);
  };

  // Download .txt
  const downloadTxt = (type) => {
    if (results.length === 0) return alert("Nenhum sorteio gerado ainda!");
    let text = "";
    if (type === "nomes") {
      text = results.map(r => `${r.name} - ${r.color}`).join("\n");
      saveAs(new Blob([text], { type: "text/plain;charset=utf-8" }), "madrinhas_cores.txt");
    } else {
      text = results.map(r => `${r.name}: ${window.location.origin}/madrinha?token=${r.token}`).join("\n");
      saveAs(new Blob([text], { type: "text/plain;charset=utf-8" }), "madrinhas_links.txt");
    }
  };

  if (enteredPassword !== PASSWORD) {
    return (
      <div style={loginStyle}>
        <h2>💍 Painel da Noiva</h2>
        <p>Digite a senha para acessar:</p>
        <input
          type="password"
          value={enteredPassword}
          onChange={e => setEnteredPassword(e.target.value)}
          placeholder="Senha"
          style={inputStyle}
        />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Painel da Noiva 👰</h1>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 15, marginBottom: 30 }}>
        <button onClick={embaralharEGerar} style={btn("#4CAF50")}>🎨 Embaralhar e Gerar</button>
        <button onClick={() => downloadTxt("nomes")} style={btn("#FF9800")}>📋 Baixar Nomes</button>
        <button onClick={() => downloadTxt("links")} style={btn("#2196F3")}>🔗 Baixar Links</button>
        <button onClick={apagarSorteio} style={btn("#E91E63")}>🗑️ Apagar Sorteio</button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>⏳ Salvando...</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
        {results.map(r => (
          <div key={r.name} style={{
            width: 200, height: 120, backgroundColor: r.rgb, color: "#fff",
            display: "flex", flexDirection: "column", justifyContent: "center",
            alignItems: "center", borderRadius: 12, boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}>
            <div style={{ marginBottom: 8 }}>
              👗 {r.name}<br />{r.color}
            </div>
            <a
              href={`${window.location.origin}/madrinha?token=${r.token}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "underline", fontSize: 14 }}
            >
              Ver Convite 💌
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const btn = color => ({
  padding: "10px 16px",
  background: color,
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 14,
  boxShadow: "0 3px 10px rgba(0,0,0,0.15)"
});

const pageStyle = {
  padding: 30,
  fontFamily: "Poppins, sans-serif",
  background: "linear-gradient(135deg, #fff, #f3f3f3)",
  minHeight: "100vh",
};

const loginStyle = {
  padding: 50,
  textAlign: "center",
  fontFamily: "Poppins, sans-serif",
  height: "100vh",
  background: "linear-gradient(135deg, #f8f8f8, #ececec)"
};

const inputStyle = {
  padding: 10,
  fontSize: 16,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginTop: 10,
  width: "200px",
  textAlign: "center"
};
