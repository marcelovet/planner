// Horários disponíveis (06:00 às 23:00)
const horariosDisponiveis = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

// Dias da semana
const diasSemana = [
  { key: 'segunda', nome: 'Segunda' },
  { key: 'terca', nome: 'Terça' },
  { key: 'quarta', nome: 'Quarta' },
  { key: 'quinta', nome: 'Quinta' },
  { key: 'sexta', nome: 'Sexta' },
  { key: 'sabado', nome: 'Sábado' },
  { key: 'domingo', nome: 'Domingo' },
];

// Cores predefinidas para atividades
const coresAtividades = [
  { cor: '#FF6B6B', nome: 'Vermelho' },
  { cor: '#4ECDC4', nome: 'Verde água' },
  { cor: '#45B7D1', nome: 'Azul' },
  { cor: '#96CEB4', nome: 'Verde' },
  { cor: '#FFEAA7', nome: 'Amarelo' },
  { cor: '#DDA0DD', nome: 'Lilás' },
  { cor: '#98D8C8', nome: 'Menta' },
  { cor: '#F7DC6F', nome: 'Dourado' },
  { cor: '#BB8FCE', nome: 'Roxo' },
  { cor: '#85C1E9', nome: 'Azul claro' },
];

// Inicializa a aba de rotina
function initRotinaTab() {
  initializeRotinaData();
  renderRotinaTable();
  setupRotinaEventListeners();
}

// Inicializa os dados da rotina se não existirem
function initializeRotinaData() {
  if (!rotinaData || Object.keys(rotinaData).length === 0) {
    rotinaData = {};
    diasSemana.forEach((dia) => {
      rotinaData[dia.key] = {};
      horariosDisponiveis.forEach((horario) => {
        rotinaData[dia.key][horario] = {
          atividade: '',
          cor: '#F3F4F6',
          observacoes: '',
        };
      });
    });
  }
}

// Renderiza a tabela de rotina
function renderRotinaTable() {
  const container = document.getElementById('rotinaContent');
  if (!container) return;

  let html = `
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-700">
            <th class="border border-gray-300 dark:border-gray-600 p-2 text-left font-semibold sticky left-0 bg-gray-50 dark:bg-gray-700 min-w-16">
              Horário
            </th>
  `;

  diasSemana.forEach((dia) => {
    html += `
      <th class="border border-gray-300 dark:border-gray-600 p-2 text-center font-semibold min-w-32">
        ${dia.nome}
      </th>
    `;
  });

  html += `
          </tr>
        </thead>
        <tbody>
  `;

  horariosDisponiveis.forEach((horario) => {
    html += `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td class="border border-gray-300 dark:border-gray-600 p-2 font-medium sticky left-0 bg-white dark:bg-gray-800 text-center">
          ${horario}
        </td>
    `;

    diasSemana.forEach((dia) => {
      const atividade = rotinaData[dia.key][horario];
      const corFundo = atividade.cor !== '#F3F4F6' ? atividade.cor : '';
      const textColor = getContrastColor(atividade.cor);

      html += `
        <td class="border border-gray-300 dark:border-gray-600 p-1 text-center relative group cursor-pointer"
            style="background-color: ${atividade.cor}; color: ${textColor};"
            onclick="editAtividade('${dia.key}', '${horario}')">
          <div class="min-h-12 flex items-center justify-center text-xs leading-tight">
            ${atividade.atividade || ''}
          </div>
          ${
            atividade.atividade
              ? `
            <button onclick="event.stopPropagation(); removeAtividade('${dia.key}', '${horario}')"
                    class="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white dark:bg-gray-800 rounded-full w-4 h-4 flex items-center justify-center">
              ×
            </button>
          `
              : ''
          }
        </td>
      `;
    });

    html += `</tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>

    <div class="mt-6 text-sm text-gray-600 dark:text-gray-400">
      <p><strong>Instruções:</strong></p>
      <ul class="list-disc list-inside mt-2 space-y-1">
        <li>Clique em qualquer célula para adicionar ou editar uma atividade</li>
        <li>Passe o mouse sobre uma célula preenchida para ver o botão de remoção</li>
        <li>Use diferentes cores para categorizar suas atividades</li>
        <li>As alterações são salvas automaticamente</li>
      </ul>
    </div>
  `;

  container.innerHTML = html;
}

// Calcula a cor do texto baseada no contraste com o fundo
function getContrastColor(hexColor) {
  if (hexColor === '#F3F4F6') return '#000000';

  // Remove o # se presente
  const hex = hexColor.replace('#', '');

  // Converte para RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calcula a luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Retorna preto ou branco baseado na luminância
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Edita uma atividade
function editAtividade(dia, horario) {
  const atividade = rotinaData[dia][horario];

  showEditModal(dia, horario, atividade);
}

// Mostra o modal de edição
function showEditModal(dia, horario, atividade) {
  const existingModal = document.getElementById('editAtividadeModal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'editAtividadeModal';
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  const diaNome = diasSemana.find((d) => d.key === dia).nome;

  let coresHtml = '';
  coresAtividades.forEach((corObj) => {
    const isSelected =
      corObj.cor === atividade.cor ? 'ring-2 ring-primary' : '';
    coresHtml += `
      <button type="button"
              class="w-8 h-8 rounded-full border-2 border-gray-300 ${isSelected}"
              style="background-color: ${corObj.cor}"
              onclick="selectColor('${corObj.cor}')"
              title="${corObj.nome}">
      </button>
    `;
  });

  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">
        Editar Atividade - ${diaNome} ${horario}
      </h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Atividade:</label>
          <input type="text"
                 id="atividadeInput"
                 value="${atividade.atividade}"
                 placeholder="Digite a atividade..."
                 class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Cor:</label>
          <div class="grid grid-cols-5 gap-2">
            ${coresHtml}
          </div>
          <input type="hidden" id="corSelecionada" value="${atividade.cor}">
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Observações:</label>
          <textarea id="observacoesInput"
                    placeholder="Observações adicionais..."
                    rows="3"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">${atividade.observacoes}</textarea>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button onclick="closeEditModal()"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          Cancelar
        </button>
        <button onclick="saveAtividade('${dia}', '${horario}')"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
          Salvar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Foca no input da atividade
  document.getElementById('atividadeInput').focus();

  // Event listener para fechar com ESC
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEditModal();
    }
  });

  // Event listener para fechar clicando fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeEditModal();
    }
  });
}

// Seleciona uma cor
function selectColor(cor) {
  // Remove seleção anterior
  const buttons = document.querySelectorAll(
    '#editAtividadeModal button[style*="background-color"]'
  );
  buttons.forEach((btn) => {
    btn.classList.remove('ring-2', 'ring-primary');
  });

  // Adiciona seleção à cor clicada
  const selectedButton = document.querySelector(
    `#editAtividadeModal button[style*="${cor}"]`
  );
  if (selectedButton) {
    selectedButton.classList.add('ring-2', 'ring-primary');
  }

  document.getElementById('corSelecionada').value = cor;
}

// Salva a atividade
function saveAtividade(dia, horario) {
  const atividade = document.getElementById('atividadeInput').value.trim();
  const cor = document.getElementById('corSelecionada').value;
  const observacoes = document.getElementById('observacoesInput').value.trim();

  rotinaData[dia][horario] = {
    atividade: atividade,
    cor: atividade ? cor : '#F3F4F6',
    observacoes: observacoes,
  };

  StorageManager.saveAllData();
  closeEditModal();
  renderRotinaTable();
}

// Remove uma atividade
function removeAtividade(dia, horario) {
  if (confirm('Tem certeza que deseja remover esta atividade?')) {
    rotinaData[dia][horario] = {
      atividade: '',
      cor: '#F3F4F6',
      observacoes: '',
    };

    StorageManager.saveAllData();
    renderRotinaTable();
  }
}

// Fecha o modal de edição
function closeEditModal() {
  const modal = document.getElementById('editAtividadeModal');
  if (modal) {
    modal.remove();
  }
}

// Configura os event listeners da rotina
function setupRotinaEventListeners() {
  // Botão de limpar rotina
  const clearBtn = document.getElementById('clearRotinaBtn');
  if (clearBtn && !clearBtn.hasAttribute('data-listener')) {
    clearBtn.setAttribute('data-listener', 'true');
    clearBtn.addEventListener('click', clearRotina);
  }

  // Botão de exportar rotina
  const exportBtn = document.getElementById('exportRotinaBtn');
  if (exportBtn && !exportBtn.hasAttribute('data-listener')) {
    exportBtn.setAttribute('data-listener', 'true');
    exportBtn.addEventListener('click', exportRotina);
  }
}

// Limpa toda a rotina
function clearRotina() {
  if (
    confirm(
      'Tem certeza que deseja limpar toda a rotina? Esta ação não pode ser desfeita.'
    )
  ) {
    initializeRotinaData();
    StorageManager.saveAllData();
    renderRotinaTable();
    alert('Rotina limpa com sucesso!');
  }
}

// Exporta a rotina para um arquivo
function exportRotina() {
  const exportData = {
    version: '1.0',
    date: new Date().toISOString(),
    rotina: rotinaData,
    title: 'Minha Rotina Semanal',
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `minha-rotina-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Função para obter estatísticas da rotina
function getRotinaStats() {
  let totalAtividades = 0;
  let horasPreenchidas = 0;
  const atividadesPorDia = {};

  diasSemana.forEach((dia) => {
    atividadesPorDia[dia.key] = 0;
    horariosDisponiveis.forEach((horario) => {
      if (
        rotinaData[dia.key] &&
        rotinaData[dia.key][horario] &&
        rotinaData[dia.key][horario].atividade
      ) {
        totalAtividades++;
        horasPreenchidas++;
        atividadesPorDia[dia.key]++;
      }
    });
  });

  const totalSlots = diasSemana.length * horariosDisponiveis.length;
  const percentualPreenchido = ((horasPreenchidas / totalSlots) * 100).toFixed(
    1
  );

  return {
    totalAtividades,
    horasPreenchidas,
    totalSlots,
    percentualPreenchido,
    atividadesPorDia,
  };
}

// Exporta funções para uso global
window.editAtividade = editAtividade;
window.removeAtividade = removeAtividade;
window.selectColor = selectColor;
window.saveAtividade = saveAtividade;
window.closeEditModal = closeEditModal;
