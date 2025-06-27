let cronogramaSemanal = {};

// Função para obter semanas necessárias calculadas
function getSemanasNecessarias() {
  const tempoTotal = materias.reduce(
    (sum, m) =>
      sum +
      m.pdfs *
        parseFloat(document.getElementById('chPorAula')?.value || 6) *
        1.5,
    0
  );
  const chPorDia = parseFloat(document.getElementById('chPorDia')?.value || 6);
  const diasTotal = Math.ceil(tempoTotal / chPorDia);
  return Math.ceil(diasTotal / 7);
}

// Initialize cronograma tab
function initCronogramaTab() {
  const container = document.getElementById('cronogramaContent');
  if (!container) return;

  // Atualiza opções de semana com base no cálculo
  updateSemanaOptions();

  const semana = parseInt(document.getElementById('semanaAtual').value);

  // Inicializa cronograma da semana se não existir
  if (!cronogramaSemanal[semana]) {
    cronogramaSemanal[semana] = {
      segunda: [],
      terca: [],
      quarta: [],
      quinta: [],
      sexta: [],
      sabado: [],
      domingo: [],
    };
  }

  renderCronograma(semana);
}

// Atualiza as opções de semana no select
function updateSemanaOptions() {
  const select = document.getElementById('semanaAtual');
  const semanasNecessarias = getSemanasNecessarias();

  const valorAnterior = select.value;
  select.innerHTML = '';

  for (let i = 1; i <= semanasNecessarias; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Semana ${i}`;

    if (valorAnterior && parseInt(valorAnterior) === i) {
      option.selected = true;
    } else if (!valorAnterior && i === 1) {
      // Se não havia seleção anterior, seleciona a primeira
      option.selected = true;
    }
    select.appendChild(option);
  }
}

// Renderiza o cronograma
function renderCronograma(semana) {
  const container = document.getElementById('cronogramaContent');
  const diasSemana = [
    'segunda',
    'terca',
    'quarta',
    'quinta',
    'sexta',
    'sabado',
    'domingo',
  ];
  const nomesDias = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo',
  ];

  let html = `
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
      <h3 class="font-semibold text-blue-900 dark:text-blue-300 mb-2">Semana ${semana}</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
  `;

  diasSemana.forEach((dia, index) => {
    html += `
      <div class="space-y-3">
        <div class="text-center">
          <h4 class="font-semibold">${nomesDias[index]}</h4>
        </div>
    `;

    // Renderiza disciplinas do dia
    const disciplinasDia = cronogramaSemanal[semana][dia] || [];

    disciplinasDia.forEach((disc, discIndex) => {
      html += `
        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm relative group">
          <button onclick="removeDisciplinaDia(${semana}, '${dia}', ${discIndex})"
                  class="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
            ✕
          </button>
          <p class="font-medium pr-4">${disc.nome}</p>
          <div class="flex items-center mt-1">
            <input type="number"
                    value="${disc.horas}"
                    min="0.5"
                    max="12"
                    step="0.5"
                    class="w-16 text-xs bg-transparent border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5"
                    onchange="updateHorasDisciplina(${semana}, '${dia}', ${discIndex}, this.value)">
            <span class="text-gray-600 dark:text-gray-400 ml-1">h</span>
          </div>
        </div>
      `;
    });

    // Botão para adicionar disciplina
    html += `
      <button onclick="showAddDisciplinaModal(${semana}, '${dia}')"
              class="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded text-sm text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors">
        + Adicionar
      </button>
    `;

    html += `</div>`;
  });

  html += `</div>`;

  // Adiciona resumo da semana
  html += renderResumoSemana(semana);

  container.innerHTML = html;

  // Adiciona event listeners
  setupCronogramaListeners();
}

// Renderiza resumo da semana
function renderResumoSemana(semana) {
  const diasSemana = [
    'segunda',
    'terca',
    'quarta',
    'quinta',
    'sexta',
    'sabado',
  ];
  let totalHoras = 0;
  let disciplinasHoras = {};

  diasSemana.forEach((dia) => {
    const disciplinas = cronogramaSemanal[semana][dia] || [];
    disciplinas.forEach((disc) => {
      totalHoras += disc.horas;
      if (!disciplinasHoras[disc.nome]) {
        disciplinasHoras[disc.nome] = 0;
      }
      disciplinasHoras[disc.nome] += disc.horas;
    });
  });

  let html = `
    <div class="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h4 class="font-semibold mb-4">Resumo da Semana ${semana}</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Total de horas planejadas:</p>
          <p class="text-2xl font-bold text-primary">${totalHoras.toFixed(
            1
          )}h</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Distribuição por disciplina:</p>
          <div class="space-y-1">
  `;

  Object.entries(disciplinasHoras).forEach(([nome, horas]) => {
    const percentual =
      totalHoras > 0 ? ((horas / totalHoras) * 100).toFixed(1) : 0;
    html += `
      <div class="flex justify-between text-sm">
        <span>${nome}:</span>
        <span class="font-medium">${horas.toFixed(1)}h (${percentual}%)</span>
      </div>
    `;
  });

  html += `
          </div>
        </div>
      </div>
    </div>
  `;

  return html;
}

// Mostra modal para adicionar disciplina
function showAddDisciplinaModal(semana, dia) {
  // Remove modal existente se houver
  const existingModal = document.getElementById('addDisciplinaModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Cria modal
  const modal = document.createElement('div');
  modal.id = 'addDisciplinaModal';
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  let optionsHtml = '';
  materias.forEach((materia) => {
    optionsHtml += `
      <label class="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
        <input type="checkbox" value="${materia.nome}" class="mr-3">
        <span>${materia.nome}</span>
      </label>
    `;
  });

  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
      <h3 class="text-lg font-semibold mb-4">Adicionar Disciplinas</h3>

      <div class="flex-1 overflow-y-auto mb-4">
        <div class="space-y-1">
          ${optionsHtml}
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Horas por disciplina:</label>
        <input type="number"
               id="horasPorDisciplina"
               value="1.5"
               min="0.5"
               max="8"
               step="0.5"
               class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
      </div>

      <div class="flex justify-end space-x-3">
        <button onclick="closeAddDisciplinaModal()"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          Cancelar
        </button>
        <button onclick="addDisciplinasSelecionadas(${semana}, '${dia}')"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
          Adicionar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Fecha modal ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAddDisciplinaModal();
    }
  });
}

// Fecha modal de adicionar disciplina
function closeAddDisciplinaModal() {
  const modal = document.getElementById('addDisciplinaModal');
  if (modal) {
    modal.remove();
  }
}

// Adiciona disciplinas selecionadas ao dia
function addDisciplinasSelecionadas(semana, dia) {
  const modal = document.getElementById('addDisciplinaModal');
  const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
  const horas =
    parseFloat(document.getElementById('horasPorDisciplina').value) || 1.5;

  checkboxes.forEach((checkbox) => {
    cronogramaSemanal[semana][dia].push({
      nome: checkbox.value,
      horas: horas,
    });
  });

  closeAddDisciplinaModal();
  renderCronograma(semana);
}

// Remove disciplina do dia
function removeDisciplinaDia(semana, dia, index) {
  cronogramaSemanal[semana][dia].splice(index, 1);
  renderCronograma(semana);
}

// Atualiza horas de uma disciplina
function updateHorasDisciplina(semana, dia, index, horas) {
  cronogramaSemanal[semana][dia][index].horas = parseFloat(horas) || 0;
  renderCronograma(semana);
}

// Configura event listeners do cronograma
function setupCronogramaListeners() {
  const semanaSelect = document.getElementById('semanaAtual');

  // Remove listener anterior se existir
  semanaSelect.removeEventListener('change', initCronogramaTab);

  // Adiciona novo listener
  semanaSelect.addEventListener('change', initCronogramaTab);
}

// Exporta cronograma para uso em relatórios
function exportCronograma() {
  return cronogramaSemanal;
}

// Limpa cronograma
function clearCronograma() {
  if (confirm('Tem certeza que deseja limpar todo o cronograma?')) {
    cronogramaSemanal = {};
    initCronogramaTab();
  }
}
