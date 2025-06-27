// Time tab functions
function initTempoTab() {
  const tabela = document.getElementById('materiasTabela');
  if (!tabela) return;

  renderMaterias();
  setupAddMateriaButton();

  ['chPorAula', 'chPorDia', 'diasPorMes'].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', () => {
        renderMaterias();
        StorageManager.saveAllData();
      });
    }
  });
}

function setupAddMateriaButton() {
  const addButton = document.getElementById('addMateria');
  if (addButton && !addButton.hasAttribute('data-listener')) {
    addButton.setAttribute('data-listener', 'true');
    addButton.addEventListener('click', addMateria);
  }
}

function renderMaterias() {
  const tabela = document.getElementById('materiasTabela');
  if (!tabela) return;

  tabela.innerHTML = '';
  let totalPdfs = 0;
  let totalCH = 0;

  materias.forEach((materia, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-200 dark:border-gray-700';

    const chPorAula = parseFloat(
      document.getElementById('chPorAula').value || 6
    );
    const chMateria = materia.pdfs * chPorAula;

    totalPdfs += materia.pdfs;
    totalCH += chMateria;

    row.innerHTML = `
    <td class="p-3 text-center font-medium">${index + 1}</td>
    <td class="p-3">
        <input type="text" value="${materia.nome}"
               class="w-full bg-transparent border-none p-0 font-medium text-base focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
               onchange="updateMateria(${index}, 'nome', this.value)">
      </td>
      <td class="p-3 text-center">
        <input type="number" value="${materia.pdfs}"
               class="w-20 text-center bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-base focus:outline-none focus:ring-2 focus:ring-primary"
               onchange="updateMateria(${index}, 'pdfs', this.value)">
      </td>
      <td class="p-3 text-center font-medium">${chMateria.toFixed(1)}h</td>
      <td class="p-3 text-center">
        <input type="number" value="${materia.peso}"
               class="w-16 text-center bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-base focus:outline-none focus:ring-2 focus:ring-primary"
               onchange="updateMateria(${index}, 'peso', this.value)">
      </td>
      <td class="p-3 text-center">
        <button onclick="removeMateria(${index})"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          🗑️
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });

  updateTotals(totalCH);
}

function updateTotals(totalCH) {
  const chPorDia = parseFloat(document.getElementById('chPorDia').value || 6);
  const diasPorMes = parseFloat(
    document.getElementById('diasPorMes').value || 26
  );

  const primeiraLeitura = totalCH;
  const revisoes = totalCH / 2;
  const total = primeiraLeitura + revisoes;

  document.getElementById(
    'primeiraLeitura'
  ).textContent = `${primeiraLeitura.toFixed(0)}h`;
  document.getElementById('revisoes').textContent = `${revisoes.toFixed(0)}h`;
  document.getElementById('totalEdital').textContent = `${total.toFixed(0)}h`;

  const diasTotal = Math.ceil(total / chPorDia);
  const mesesTotal = Math.ceil(diasTotal / diasPorMes);
  const semanasTotal = Math.ceil(diasTotal / 7);

  document.getElementById('diasTotal').textContent = `${diasTotal} dias`;
  document.getElementById('mesesTotal').textContent = `${mesesTotal.toFixed(
    1
  )} meses`;
  document.getElementById(
    'semanasTotal'
  ).textContent = `${semanasTotal} semanas`;
  document.getElementById(
    'disciplinasTotal'
  ).textContent = `${materias.length} disciplinas`;
}
