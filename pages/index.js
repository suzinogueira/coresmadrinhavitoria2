import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

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

// 🔸 separação dos lados
const ladoNoiva = ["Nelzi","Aldri","Katia","Gracieli","Ana Beatriz","Elisangela","Eduarda","Ketlin","Jamile","Sara"];
const ladoNoivo = ["Sara","Guiomar","Talita","Rebeca","Bruna","Daniela","Graziele","Leni","Almira","Kelly"];

export default function Admin() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [results, setResults] = useState({ noiva: [], noivo: [] });
  const [loadingSave, setLoadingSave] = useState(false);

  // 🔹 carrega sorteio existente
  useEffect(() => {
    fetch('/api/get-sorteio')
      .then(async (r) => (r.ok ? r.json() : {}))
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          const noiva = Object.keys(data)
            .filter(name => ladoNoiva.includes(name))
            .map(name => ({ name, color: data[name].color, rgb: data[name].rgb, token: btoa(name) }));
          const noivo = Object.keys(data)
            .filter(name => ladoNoivo.includes(name))
            .map(name => ({ name, color: data[name].color, rgb: data[name].rgb, token: btoa(name) }));
          setResults({ noiva, noivo });
        }
      })
      .catch(() => setResults({ noiva: [], noivo: [] }));
  }, []);

  // 🔹 função de sorteio
  const embaralharEGerar = async () => {
    // se já houver sorteio salvo, confirmar substituição
    if ((results.noiva.length || results.noivo.length) && !confirm('⚠️ Já existe um sorteio salvo. Deseja substituir o atual?')) {
      return;
    }

    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

    const shuffledNoiva = shuffle(ladoNoiva);
    const shuffledNoivo = shuffle(ladoNoivo);

    const noivaResult = shuffledNoiva.map((name, i) => ({
      name,
      color: colors[i].name,
      rgb: colors[i].rgb,
      token: btoa(name)
    }));

    const noivoResult = shuffledNoivo.map((name, i) => ({
      name,
      color: colors[i].name,
      rgb: colors[i].rgb,
      token: btoa(name)
    }));

    setResults({ noiva: noivaResult, noivo: noivoResult });

    const objToSave = {};
    [...noivaResult, ...noivoResult].forEach(r => {
      objToSave[r.name] = { color: r.color, rgb: r.rgb };
    });

    setLoadingSave(true);
    const resp = await fetch('/api/save-sorteio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sorteio: objToSave })
    });
    setLoadingSave(false);

    if (resp.ok) {
      alert('🎉 Sorteio salvo com sucesso!');
    } else {
      const txt = await resp.text();
      alert('Erro ao salvar: ' + txt);
    }
  };

  // 🔹 baixa arquivos .txt
  const downloadTxt = (type) => {
    if (!results.noiva.length && !results.noivo.length) return alert('Nenhum sorteio gerado ainda.');

    let text = '';
    if (type === 'nomes') {
      text += '💖 Lado da Noiva\n';
      text += results.noiva.map(r => `${r.name} - ${r.color}`).join('\n') + '\n\n';
      text += '🤵 Lado do Noivo\n';
      text += results.noivo.map(r => `${r.name} - ${r.color}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'madrinhas_cores.txt');
    } else {
      text += '💖 Lado da Noiva\n';
      text += results.noiva.map(r => `${r.name}: ${window.location.origin}/madrinha?token=${r.token}&color=${encodeURIComponent(r.color)}`).join('\n') + '\n\n';
      text += '🤵 Lado do Noivo\n';
      text += results.noivo.map(r => `${r.name}: ${window.location.origin}/madrinha?token=${r.token}&color=${encodeURIComponent(r.color)}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'madrinhas_links.txt');
    }
  };

  // 🔹 apaga sorteio existente
  const apagarSorteio = async () => {
    if (!confirm('Tem certeza que deseja apagar o sorteio atual?')) return;
    setLoadingSave(true);
    const resp = await fetch('/api/delete-sorteio', { method: 'POST' });
    setLoadingSave(false);
    if (resp.ok) {
      setResults({ noiva: [], noivo: [] });
      alert('Sorteio apagado.');
    } else {
      alert('Erro ao apagar sorteio.');
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Poppins, sans-serif', minHeight: '100vh', background: '#f7f7f8' }}>
      {enteredPassword !== PASSWORD ? (
        <div style={{ textAlign: 'center', marginTop: 120 }}>
          <h2>🔒 Painel da Noiva</h2>
          <input
            type="password"
            placeholder="Senha"
            value={enteredPassword}
            onChange={e => setEnteredPassword(e.target.value)}
            style={{ padding: 10, borderRadius: 8, width: 200, border: '1px solid #ccc' }}
          />
        </div>
      ) : (
        <>
          <h1 style={{ textAlign: 'center', color: '#9B59B6' }}>💍 Cores das Madrinhas</h1>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            <button onClick={embaralharEGerar} style={btn('#9B59B6')}>{loadingSave ? 'Salvando...' : '🔀 Sortear e Salvar'}</button>
            <button onClick={apagarSorteio} style={btn('#E74C3C')}>🧹 Apagar sorteio</button>
            <button onClick={() => downloadTxt('nomes')} style={btn('#1ABC9C')}>📄 Baixar (nomes+cores)</button>
            <button onClick={() => downloadTxt('links')} style={btn('#3498DB')}>🔗 Baixar (links)</button>
          </div>

          {/* --- Seções separadas --- */}
          <div style={{ marginTop: 30 }}>
            <h2>💖 Lado da Noiva</h2>
            <div style={grid}>
              {results.noiva.map(r => card(r))}
            </div>

            <h2 style={{ marginTop: 40 }}>🤵 Lado do Noivo</h2>
            <div style={grid}>
              {results.noivo.map(r => card(r))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function card(r) {
  return (
    <div key={r.name} style={{ background: r.rgb, color: '#fff', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{r.name}</div>
      <div style={{ marginTop: 8 }}>{r.color}</div>
      <a style={{ color: '#fff', marginTop: 10, display: 'inline-block', textDecoration: 'underline' }} href={`/madrinha?token=${r.token}&color=${encodeURIComponent(r.color)}`} target="_blank" rel="noreferrer">Ver convite</a>
    </div>
  );
}

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginTop: 10 };
const btn = (bg) => ({ padding: '10px 16px', borderRadius: 8, border: 'none', background: bg, color: '#fff', cursor: 'pointer', fontWeight: '600' });
