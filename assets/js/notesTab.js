// Inicializa a aba de anotações
function initNotesTab() {
  initializeNotesData();
  renderNotesTable();
  setupNotesEventListeners();
}

// Inicializa os dados das anotações se não existirem
function initializeNotesData() {
  if (!notesData || !Array.isArray(notesData)) {
    notesData = [];
  }
}

// Renderiza a tabela de anotações
function renderNotesTable() {
  const container = document.getElementById('notesContent');
  if (!container) return;

  let html = `
    <div class="mb-6 flex justify-between items-center">
      <h3 class="text-lg font-semibold">Minhas Anotações</h3>
      <button
        id="addNoteBtn"
        class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <span>📝</span>
        Adicionar Anotação
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-700">
            <th class="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold w-16">
              #
            </th>
            <th class="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold min-w-48">
              Título
            </th>
            <th class="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">
              Conteúdo
            </th>
            <th class="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold w-32">
              Data
            </th>
            <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-semibold w-24">
              Ações
            </th>
          </tr>
        </thead>
        <tbody id="notesTableBody">
  `;

  if (notesData.length === 0) {
    html += `
      <tr>
        <td colspan="5" class="border border-gray-300 dark:border-gray-600 p-8 text-center text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center gap-2">
            <span class="text-2xl">📝</span>
            <p>Nenhuma anotação encontrada</p>
            <p class="text-sm">Clique em "Adicionar Anotação" para começar</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    notesData.forEach((note, index) => {
      const shortContent =
        note.content.length > 100
          ? note.content.substring(0, 100) + '...'
          : note.content;

      html += `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium">
            ${index + 1}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3 font-medium">
            ${escapeHtml(note.title)}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3">
            <div class="max-w-md">
              ${escapeHtml(shortContent)}
              ${
                note.content.length > 100
                  ? `
                <button onclick="viewNote(${index})" class="text-primary hover:underline ml-2 text-xs">
                  Ver mais
                </button>
              `
                  : ''
              }
            </div>
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3 text-sm text-gray-600 dark:text-gray-400">
            ${formatDate(note.createdAt)}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3 text-center">
            <div class="flex justify-center gap-2">
              <button onclick="editNote(${index})"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Editar">
                ✏️
              </button>
              <button onclick="deleteNote(${index})"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Excluir">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    });
  }

  html += `
        </tbody>
      </table>
    </div>

    <div class="mt-6 text-sm text-gray-600 dark:text-gray-400">
      <p><strong>Estatísticas:</strong></p>
      <ul class="list-disc list-inside mt-2 space-y-1">
        <li>Total de anotações: ${notesData.length}</li>
        <li>Última atualização: ${getLastUpdateDate()}</li>
        <li>As anotações são salvas automaticamente</li>
        <li>Todas as anotações serão incluídas no relatório PDF</li>
      </ul>
    </div>
  `;

  container.innerHTML = html;
}

// Escapa HTML para prevenir XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Formata data para exibição
function formatDate(dateString) {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('pt-BR') +
    ' ' +
    date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
}

// Obtém a data da última atualização
function getLastUpdateDate() {
  if (notesData.length === 0) {
    return 'Nunca';
  }

  const lastNote = notesData.reduce((latest, note) => {
    return new Date(note.updatedAt || note.createdAt) >
      new Date(latest.updatedAt || latest.createdAt)
      ? note
      : latest;
  });

  return formatDate(lastNote.updatedAt || lastNote.createdAt);
}

// Adiciona uma nova anotação
function addNote() {
  showNoteModal();
}

// Edita uma anotação existente
function editNote(index) {
  const note = notesData[index];
  showNoteModal(note, index);
}

// Visualiza uma anotação completa
function viewNote(index) {
  const note = notesData[index];
  showViewModal(note);
}

// Exclui uma anotação
function deleteNote(index) {
  const note = notesData[index];
  if (confirm(`Tem certeza que deseja excluir a anotação "${note.title}"?`)) {
    notesData.splice(index, 1);
    StorageManager.saveAllData();
    renderNotesTable();
    setupNotesEventListeners(); // Re-setup listeners after re-render
  }
}

// Mostra o modal de visualização
function showViewModal(note) {
  const existingModal = document.getElementById('viewNoteModal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'viewNoteModal';
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">${escapeHtml(note.title)}</h3>
        <button onclick="closeViewModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ✕
        </button>
      </div>

      <div class="flex-1 overflow-y-auto mb-4">
        <div class="whitespace-pre-wrap break-words">${escapeHtml(
          note.content
        )}</div>
      </div>

      <div class="text-sm text-gray-600 dark:text-gray-400 border-t pt-4">
        <p>Criado em: ${formatDate(note.createdAt)}</p>
        ${
          note.updatedAt
            ? `<p>Atualizado em: ${formatDate(note.updatedAt)}</p>`
            : ''
        }
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners para fechar o modal
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeViewModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeViewModal();
    }
  });
}

// Fecha o modal de visualização
function closeViewModal() {
  const modal = document.getElementById('viewNoteModal');
  if (modal) {
    modal.remove();
  }
}

// Mostra o modal de edição/criação
function showNoteModal(note = null, index = null) {
  const existingModal = document.getElementById('noteModal');
  if (existingModal) {
    existingModal.remove();
  }

  const isEditing = note !== null;
  const modal = document.createElement('div');
  modal.id = 'noteModal';
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
      <h3 class="text-lg font-semibold mb-4">
        ${isEditing ? 'Editar Anotação' : 'Nova Anotação'}
      </h3>

      <div class="flex-1 flex flex-col space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Título:</label>
          <input type="text"
                 id="noteTitle"
                 value="${isEditing ? escapeHtml(note.title) : ''}"
                 placeholder="Digite o título da anotação..."
                 maxlength="100"
                 class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
        </div>

        <div class="flex-1 flex flex-col">
          <label class="block text-sm font-medium mb-2">Conteúdo:</label>
          <textarea id="noteContent"
                    placeholder="Digite o conteúdo da anotação..."
                    rows="12"
                    class="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 resize-none">${
                      isEditing ? escapeHtml(note.content) : ''
                    }</textarea>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button onclick="closeNoteModal()"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          Cancelar
        </button>
        <button onclick="saveNote(${index})"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
          ${isEditing ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Foca no input do título
  const titleInput = document.getElementById('noteTitle');
  titleInput.focus();

  // Event listeners para fechar o modal
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNoteModal();
    }
    // Ctrl+Enter para salvar
    if (e.ctrlKey && e.key === 'Enter') {
      saveNote(index);
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeNoteModal();
    }
  });
}

// Salva a anotação
function saveNote(index = null) {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();

  if (!title) {
    alert('Por favor, digite um título para a anotação.');
    document.getElementById('noteTitle').focus();
    return;
  }

  if (!content) {
    alert('Por favor, digite o conteúdo da anotação.');
    document.getElementById('noteContent').focus();
    return;
  }

  const now = new Date().toISOString();

  if (index !== null) {
    // Editando anotação existente
    notesData[index] = {
      ...notesData[index],
      title: title,
      content: content,
      updatedAt: now,
    };
  } else {
    // Criando nova anotação
    const newNote = {
      id: Date.now(), // ID simples baseado em timestamp
      title: title,
      content: content,
      createdAt: now,
      updatedAt: null,
    };
    notesData.push(newNote);
  }

  StorageManager.saveAllData();
  closeNoteModal();
  renderNotesTable();
  setupNotesEventListeners(); // Re-setup listeners after re-render
}

// Fecha o modal de edição/criação
function closeNoteModal() {
  const modal = document.getElementById('noteModal');
  if (modal) {
    modal.remove();
  }
}

// Configura os event listeners das anotações
function setupNotesEventListeners() {
  // Remove listener anterior se existir
  const addBtn = document.getElementById('addNoteBtn');
  if (addBtn) {
    // Clone o botão para remover todos os event listeners
    const newAddBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAddBtn, addBtn);

    // Adiciona o novo event listener
    newAddBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      addNote();
    });
  }
}

// Limpa todas as anotações
function clearAllNotes() {
  if (
    confirm(
      'Tem certeza que deseja excluir todas as anotações? Esta ação não pode ser desfeita.'
    )
  ) {
    notesData.length = 0;
    StorageManager.saveAllData();
    renderNotesTable();
    setupNotesEventListeners(); // Re-setup listeners after clear
    alert('Todas as anotações foram excluídas!');
  }
}

// Exporta anotações para uso global
window.addNote = addNote;
window.editNote = editNote;
window.viewNote = viewNote;
window.deleteNote = deleteNote;
window.saveNote = saveNote;
window.closeNoteModal = closeNoteModal;
window.closeViewModal = closeViewModal;
window.clearAllNotes = clearAllNotes;
