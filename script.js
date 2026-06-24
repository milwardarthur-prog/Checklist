const EQUIPAMENTOS = [
  "GE-02-50", "GE-03-40", "GE-04-55", "GE-05-55", "GE-06-115", "GE-09-170", "GE-10-25", "GE-11-75",
  "GE-12-75", "GE-13-500", "GE-14-140", "GE-15-170", "GE-16-40", "GE-17-81", "GE-18-100", "GE-19-81",
  "GE-20-54", "GE-21-54", "GE-22-54", "GE-23-54", "GE-24-54", "GE-25-60", "GE-26-75", "GE-27-180",
  "GE-28-81", "GE-29-85", "GE-30-105", "GE-31-105", "GE-32-115", "GE-33-115", "GE-34-115", "GE-35-150",
  "GE-36-150", "GE-37-180", "GE-38-180", "GE-39-180", "GE-40-180", "GE-41-220", "GE-42-450", "GE-43-450",
  "GE-44-260", "GE-45-40", "GE-46-25", "GE-47-115", "GE-48-15", "GE-49-55", "GE-50-55", "GE-51-550",
  "GE-52-212", "GE-53-140", "GE-54-55", "GE-55-55", "GE-56-55", "GE-57-55", "GE-58-81", "GE-59-180",
  "GE-60-180", "GE-61-230", "GE-62-81", "GE-63-40", "GE-64-55", "GE-65-230", "GE-66-80", "GE-67-100",
  "GE-68-50", "GE-69-260", "GE-70-40", "GE-71-81", "GE-72-140", "GE-73-260", "GE-74-375", "GE-75-25",
  "GE-76-81", "GE-77-140", "GE-78-81", "GE-79-81", "GE-80-81", "GE-81-50", "GE-82-100", "GE-83-140",
  "GE-84-81", "GE-85-140", "GE-86-81", "GE-87-81", "GE-88-55", "GE-89-55", "GE-90-20", "GE-91-70",
  "GE-92-80", "GE-93-85", "GE-94-200", "GE-95-460", "GE-96-27", "GE-97-33", "GE-98-250", "GE-99-36",
  "GE-100-125", "GE-101-12", "GE-102-55", "GE-103-150", "GE-104-65", "GE-105-45", "GE-106-500", "GE-107-230",
  "GE-108-125", "GE-109-25", "GE-110-80", "GE-111-125", "GE-112-125", "GE-113-360", "GE-114-360"
];

let dadosMaster = [];

// ── Carrega o CSV ──
function carregarCSV() {
  renderizar(EQUIPAMENTOS);
  document.getElementById('stats').innerText = `0 de ${EQUIPAMENTOS.length} equipamentos (Lendo banco...)`;

  Papa.parse("dados.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      if (results.data && results.data.length > 0) {
        dadosMaster = results.data;
        atualizarStats();
        renderizar(EQUIPAMENTOS);
      } else {
        document.getElementById('stats').innerText = `Banco de dados vazio ou mal formatado.`;
      }
    },
    error: function() {
      document.getElementById('stats').innerText = `0 de ${EQUIPAMENTOS.length} equipamentos (Sem banco de dados)`;
      renderizar(EQUIPAMENTOS);
    }
  });
}

// ── Atualiza contador no header ──
function atualizarStats() {
  const comDados = EQUIPAMENTOS.filter(e => dadosMaster.some(d => d.Equipamento === e)).length;
  document.getElementById('stats').innerText = `${comDados} de ${EQUIPAMENTOS.length} equipamentos com checklist`;
}

// ── Retorna badge HTML conforme valor ──
function badge(valor) {
  if (!valor) return `<span class="badge badge-alert">—</span>`;
  const v = valor.trim().toLowerCase();
  if (v === 'boa' || v === 'bom')
    return `<span class="badge badge-ok">${valor}</span>`;
  if (v === 'ruim')
    return `<span class="badge badge-bad">${valor}</span>`;
  if (v === 'trocado')
    return `<span class="badge badge-alert">${valor}</span>`;
  return `<span class="badge badge-alert">${valor}</span>`;
}

// ── Renderiza os cards no grid ──
function renderizar(lista) {
  const grid = document.getElementById('equipmentsGrid');
  grid.innerHTML = "";

  [...lista].sort((a, b) => {
    const numA = parseInt(a.split('-')[1]);
    const numB = parseInt(b.split('-')[1]);
    return numA - numB;
  }).forEach(nome => {
    // Pega o registro mais recente do equipamento
    const registros = dadosMaster.filter(d => d.Equipamento === nome);
    const ultimo = registros.length > 0 ? registros[registros.length - 1] : null;

    const card = document.createElement('div');
    card.className = `card ${ultimo ? 'has-data' : ''}`;

    if (ultimo) {
      card.innerHTML = `
        <div class="card-title">${nome}</div>
        <div class="card-info">
          <div class="card-info-row">
            <span class="label">Horímetro</span>
            <span class="value">${ultimo.Horimetro ? ultimo.Horimetro + ' h' : '—'}</span>
          </div>
          <div class="card-info-row">
            <span class="label">Responsável</span>
            <span class="value">${ultimo.Responsavel || '—'}</span>
          </div>
          <div class="card-info-row">
            <span class="label">Data</span>
            <span class="value">${ultimo.Data || '—'}</span>
          </div>
        </div>
        <hr class="card-divider"/>
        <div class="card-filters">
          <div class="card-filter-row">
            <span class="label">Amostra Tanque</span>
            ${badge(ultimo.AmostraTanque)}
          </div>
          <div class="card-filter-row">
            <span class="label">Filtro Comb.</span>
            ${badge(ultimo.FiltroCombustivel)}
          </div>
          <div class="card-filter-row">
            <span class="label">Racor 1</span>
            ${badge(ultimo.FiltroRacor1)}
          </div>
          <div class="card-filter-row">
            <span class="label">Racor 2</span>
            ${badge(ultimo.FiltroRacor2)}
          </div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="card-title">${nome}</div>
        <div class="card-empty">Sem checklist registrado</div>
      `;
    }

    card.onclick = () => abrirHistorico(nome);
    grid.appendChild(card);
  });
}

// ── Abre o modal com histórico completo ──
function abrirHistorico(nome) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  document.getElementById('modalTitle').innerText = nome;

  const historico = dadosMaster.filter(d => d.Equipamento === nome);

  if (historico.length === 0) {
    modalBody.innerHTML = `<div class="no-data"><i class="fa-solid fa-folder-open" style="font-size:2rem;margin-bottom:8px;display:block;"></i>Nenhum checklist registrado para este equipamento.</div>`;
  } else {
    modalBody.innerHTML = [...historico].reverse().map((row, i) => `
      <div class="checklist-entry">
        <div class="checklist-entry-header">
          <span>Registro #${historico.length - i}</span>
          <span>${row.Data || '—'}</span>
        </div>
        <div class="checklist-entry-body">
          <div class="entry-row">
            <span class="entry-label">Horímetro</span>
            <span class="entry-value">${row.Horimetro ? row.Horimetro + ' h' : '—'}</span>
          </div>
          <div class="entry-row">
            <span class="entry-label">Responsável</span>
            <span class="entry-value">${row.Responsavel || '—'}</span>
          </div>
          <div class="entry-row">
            <span class="entry-label">Amostra do Tanque</span>
            <span class="entry-value">${badge(row.AmostraTanque)}</span>
          </div>
          <div class="entry-row">
            <span class="entry-label">Filtro Combustível</span>
            <span class="entry-value">${badge(row.FiltroCombustivel)}</span>
          </div>
          <div class="entry-row">
            <span class="entry-label">Filtro Racor 1</span>
            <span class="entry-value">${badge(row.FiltroRacor1)}</span>
          </div>
          <div class="entry-row">
            <span class="entry-label">Filtro Racor 2</span>
            <span class="entry-value">${badge(row.FiltroRacor2)}</span>
          </div>
          ${row.Observacao ? `
          <div class="entry-obs">
            <span>Observação</span>
            ${row.Observacao}
          </div>` : ''}
        </div>
      </div>
    `).join('');
  }

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

// ── Busca ──
document.getElementById('searchInput').oninput = (e) => {
  const termo = e.target.value.toLowerCase();
  const filtrados = EQUIPAMENTOS.filter(eq => eq.toLowerCase().includes(termo));
  renderizar(filtrados);
};

// ── Fechar Modal ──
const fechar = () => {
  document.getElementById('modal').style.display = "none";
  document.body.style.overflow = "auto";
};
document.getElementById('closeModal').onclick = fechar;
window.onclick = (e) => { if (e.target.id === 'modal') fechar(); };

// ── Início ──
carregarCSV();
