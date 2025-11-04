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

const madrinhasLista = [
  "Nelzi","Aldri","Kátia","Gracieli","Ana Beatriz",
  "Elisângela","Eduarda","Ketlin","Jamile","Simone",
  "Sara","Guiomar","Thalyta","Rebeca","Bruna",
  "Daniela","Graziele","Leni","Almira","Kelly"
];

export default function Admin() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);

  // 🔹 carrega o sorteio existente (se houver)
  useEffect(() => {
    fetch('/api/get-sorteio')
      .then(async (r) => {
        if (!r.ok) {
          console.warn('Nenhum sorteio encontrado ainda.');
          return {};
        }
        return r.json();
      })
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          const arr = Object.keys(data).map(name => ({
            name,
            color: data[name].color,
            rgb: data[name].rgb,
            token: btoa(name)
          }));
          setResults(arr);
        } else {
          setResults([]);
        }
      })
      .catch(err => {
        console.error('Erro carregando sorteio:', err);
        setResults([]);
      });
  }, []);

  // 🔹 sorteia e salva no GitHub
  const embaralharEGerar = async () => {
    const shuffled = [...madrinhasLista].sort(() => Math.random() - 0.5);
    const pairs = [];
    for (let i = 0; i < colors.length; i++) {
      pairs.push({ m1: shuffled[i*2], m2: shuffled[i*2+1], color: colors[i] });
    }
    const links = [];
    pairs.forEach(p => {
      links.push({ name: p.m1, color: p.color.name, rgb: p.color.rgb, token: btoa(p.m1) });
      links.push({ name: p.m2, color: p.color.name, rgb: p.color.rgb, token: btoa(p.m2) });
    });
    setResults(links);

    const objToSave = {};
    links.forEach(l => {
      objToSave[l.name] = { color: l.color, rgb: l.rgb };
    });

    setLoadingSave(true);
    const resp = await fetch('/api/save-sorteio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sorteio: objToSave })
    });
    setLoadingSave(false);

    if (resp.ok) {
      alert('🎉 Sorteio salvo com sucesso! As madrinhas já podem abrir seus convites.');
    } else {
      const txt = await resp.text();
      alert('Erro ao salvar no repositório: ' + txt);
    }
  };

  // 🔹 apaga o sorteio existente
  const apagarSorteio = async () => {
    if (!confirm('Tem certeza que deseja apagar o sorteio atual?')) return;
    setLoadingSave(true);
    const resp = await fetch('/api/delete-sorteio', { method: 'POST' });
    setLoadingSave(false);
    if (resp.ok) {
      setResults([]);
      alert('Sorteio apagado.');
    } else {
      const txt = await resp.text();
      alert('Erro ao apagar: ' + txt);
    }
  };

  // 🔹 baixa arquivo txt
  const downloadTxt = (type) => {
    if (!results.length) return alert('Nenhum sorteio gerado ainda.');
    let text = '';
    if (type === 'nomes') {
      text = results.map(r => `${r.name} - ${r.color}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'madrinhas_cores.txt');
    } else {
      text = results.map(r => `${r.name}: ${window.location.origin}/madrinha?token=${r.token}&color=${encodeURIComponent(r.color)}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'madrinhas_links.txt');
    }
  };

  // 🔹 ver sorteio público (sem quebrar se não existir)
  const verSorteioPublico = async () => {
    try {
      const r = await fetch('/api/get-sorteio');
      if (!r.ok) return alert('Nenhum sorteio público encontrado ainda.');
      const data = await r.json();
      if (!data || Object.keys(data).length === 0) return alert('Nenhum sorteio público encontrado.');
      const arr = Object.keys(data).map(name => ({
        name,
        color: data[name].color,
        rgb: data[name].rgb,
        token: btoa(name)
      }));
      setResults(arr);
    } catch (err) {
      alert('Erro ao carregar sorteio público.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Poppins, sans-serif', minHeight: '100vh', background: '#f7f7f8' }}>
      {enteredPassword !== PASSWORD ? (
        <div style={{ textAlign: 'center', marginTop: 120 }}>
          <h2>🔒 Painel da Noiva</h2>
          <p>Coloque a senha para acessar</p>
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
            <button onClick={verSorteioPublico} style={btn('#6C3483')}>👀 Ver sorteio público</button>
            <button onClick={apagarSorteio} style={btn('#E74C3C')}>🧹 Apagar sorteio</button>
            <button onClick={() => downloadTxt('nomes')} style={btn('#1ABC9C')}>📄 Baixar (nomes+cores)</button>
            <button onClick={() => downloadTxt('links')} style={btn('#3498DB')}>🔗 Baixar (links)</button>
          </div>

          <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {(results || []).map(r => (
              <div key={r.name} style={{ background: r.rgb, color: '#fff', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{r.name}</div>
                <div style={{ marginTop: 8 }}>{r.color}</div>
                <a style={{ color: '#fff', marginTop: 10, display: 'inline-block', textDecoration: 'underline' }} href={`/madrinha?token=${r.token}&color=${encodeURIComponent(r.color)}`} target="_blank" rel="noreferrer">Ver convite</a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function btn(bg) {
  return { padding: '10px 16px', borderRadius: 8, border: 'none', background: bg, color: '#fff', cursor: 'pointer', fontWeight: '600' };
}
