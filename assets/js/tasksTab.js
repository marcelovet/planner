// Initialize tasks tab
function initTasksTab() {
  initializeTasksData();
  renderTasksTable();
  setupTasksEventListeners();
}

// Initialize tasks data if it doesn't exist
function initializeTasksData() {
  if (!tasksData || !Array.isArray(tasksData)) {
    tasksData = [];
  }
}

function taskIsOverdue(task) {
  if (!task.dueDate) return false;

  const year = parseInt(task.dueDate.substring(0, 4));
  const month = parseInt(task.dueDate.substring(5, 7)) - 1;
  const day = parseInt(task.dueDate.substring(8, 10));

  const date = new Date(year, month, day);
  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return date < todayDateOnly && !task.completed;
}

function taskIsDueSoon(task) {
  if (!task.dueDate) return false;

  const year = parseInt(task.dueDate.substring(0, 4));
  const month = parseInt(task.dueDate.substring(5, 7)) - 1;
  const day = parseInt(task.dueDate.substring(8, 10));

  const date = new Date(year, month, day);
  const dueSoon = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const dueSoonDateOnly = new Date(
    dueSoon.getFullYear(),
    dueSoon.getMonth(),
    dueSoon.getDate()
  );

  return date <= dueSoonDateOnly && !task.completed && !taskIsOverdue(task);
}

// Render tasks table
function renderTasksTable() {
  const container = document.getElementById('tasksContent');
  if (!container) return;

  const isMobile = window.innerWidth <= 768;

  // Sort tasks: uncompleted first, then by due date
  const sortedTasks = [...tasksData].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  let html = `
    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <h3 class="text-lg font-semibold">Minhas Tarefas</h3>
      <button
        id="addTaskBtn"
        class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
      >
        <span>✅</span>
        Adicionar Tarefa
      </button>
    </div>
  `;

  if (sortedTasks.length === 0) {
    html += `
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
        <div class="flex flex-col items-center gap-2">
          <span class="text-4xl sm:text-2xl mb-2">📋</span>
          <p class="text-lg sm:text-base">Nenhuma tarefa encontrada</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Clique em "Adicionar Tarefa" para começar</p>
        </div>
      </div>
    `;
  } else if (isMobile) {
    // Mobile card layout
    html += '<div class="space-y-3">';

    sortedTasks.forEach((task, index) => {
      const originalIndex = tasksData.findIndex((t) => t.id === task.id);
      const isOverdue = taskIsOverdue(task);
      const isDueSoon = taskIsDueSoon(task);

      // Truncar descrição se necessário
      const shortDescription =
        task.description && task.description.length > 100
          ? task.description.substring(0, 100) + '...'
          : task.description;

      html += `
        <div class="mobile-card ${task.completed ? 'opacity-60' : ''} ${
        isOverdue
          ? 'border-red-500 border-2'
          : isDueSoon
          ? 'border-yellow-500 border-2'
          : ''
      }">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-start gap-3 flex-1">
              <input type="checkbox"
                     ${task.completed ? 'checked' : ''}
                     onchange="toggleTaskComplete(${originalIndex})"
                     class="mt-1 w-5 h-5 cursor-pointer">
              <div class="flex-1">
                <h4 class="font-semibold text-base ${
                  task.completed ? 'line-through' : ''
                }">${escapeHtml(task.title)}</h4>
                ${
                  task.dueDate
                    ? `
                  <p class="text-xs mt-1 ${
                    isOverdue
                      ? 'text-red-600 dark:text-red-400 font-semibold'
                      : isDueSoon
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }">
                    ${isOverdue ? '⚠️ Atrasada - ' : isDueSoon ? '⏰ ' : '📅 '}
                    ${formatDueDate(task.dueDate)}
                  </p>
                `
                    : ''
                }
              </div>
            </div>
            <div class="flex gap-2">
              <button onclick="editTask(${originalIndex})"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                ✏️
              </button>
              <button onclick="deleteTask(${originalIndex})"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1">
                🗑️
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            ${formatDate(task.createdAt)}
          </p>
          ${
            task.description
              ? `
            <div class="text-sm mt-2 ${task.completed ? 'line-through' : ''}">
              ${escapeHtml(shortDescription)}
              ${
                task.description.length > 100
                  ? `
                <button onclick="viewTask(${originalIndex})" class="text-primary hover:underline ml-1 text-xs">
                  Ver mais
                </button>
              `
                  : ''
              }
            </div>
          `
              : ''
          }
        </div>
      `;
    });

    html += '</div>';
  } else {
    // Desktop table layout
    html += `
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700">
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-semibold w-16">
                ✓
              </th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold min-w-48">
                Título
              </th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold">
                Descrição
              </th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold w-40">
                Data Limite
              </th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold w-32">
                Criada em
              </th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-semibold w-24">
                Ações
              </th>
            </tr>
          </thead>
          <tbody id="tasksTableBody">
    `;

    sortedTasks.forEach((task, index) => {
      const originalIndex = tasksData.findIndex((t) => t.id === task.id);
      const isOverdue = taskIsOverdue(task);
      const isDueSoon = taskIsDueSoon(task);

      // Truncar descrição se necessário
      const shortDescription =
        task.description && task.description.length > 100
          ? task.description.substring(0, 100) + '...'
          : task.description;

      html += `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 ${
          task.completed ? 'opacity-60' : ''
        } ${
        isOverdue
          ? 'bg-red-50 dark:bg-red-900/20'
          : isDueSoon
          ? 'bg-yellow-50 dark:bg-yellow-900/20'
          : ''
      }">
          <td class="border border-gray-300 dark:border-gray-600 p-3 text-center">
            <input type="checkbox"
                   ${task.completed ? 'checked' : ''}
                   onchange="toggleTaskComplete(${originalIndex})"
                   class="w-5 h-5 cursor-pointer">
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3 font-medium ${
            task.completed ? 'line-through' : ''
          }">
            ${escapeHtml(task.title)}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3 ${
            task.completed ? 'line-through' : ''
          }">
            <div class="max-w-md">
              ${task.description ? escapeHtml(shortDescription) : '-'}
              ${
                task.description && task.description.length > 100
                  ? `
                <button onclick="viewTask(${originalIndex})" class="text-primary hover:underline ml-2 text-xs">
                  Ver mais
                </button>
              `
                  : ''
              }
            </div>
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3 text-sm ${
            isOverdue
              ? 'text-red-600 dark:text-red-400 font-semibold'
              : isDueSoon
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-gray-600 dark:text-gray-400'
          }">
            ${task.dueDate ? formatDueDate(task.dueDate) : '-'}
            ${isOverdue ? ' ⚠️' : isDueSoon ? ' ⏰' : ''}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3 text-sm text-gray-600 dark:text-gray-400">
            ${formatDate(task.createdAt)}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-3 text-center">
            <div class="flex justify-center gap-2">
              <button onclick="editTask(${originalIndex})"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Editar">
                ✏️
              </button>
              <button onclick="deleteTask(${originalIndex})"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Excluir">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  // Statistics
  const totalTasks = tasksData.length;
  const completedTasks = tasksData.filter((t) => t.completed).length;
  const overdueTasks = tasksData.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
  ).length;

  html += `
    <div class="mt-6 text-sm text-gray-600 dark:text-gray-400">
      <p><strong>Estatísticas:</strong></p>
      <ul class="list-disc list-inside mt-2 space-y-1">
        <li>Total de tarefas: ${totalTasks}</li>
        <li>Tarefas concluídas: ${completedTasks} (${
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
  }%)</li>
        <li>Tarefas em atraso: ${overdueTasks}</li>
        <li>As tarefas são salvas automaticamente</li>
        <li>Todas as tarefas serão incluídas no relatório PDF</li>
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

// Format due date
function formatDueDate(dateString) {
  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(5, 7)) - 1;
  const day = parseInt(dateString.substring(8, 10));

  const date = new Date(year, month, day);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const dateFormatted = date.toLocaleDateString('pt-BR');

  if (diffDays === 0) {
    return `Hoje - ${dateFormatted}`;
  } else if (diffDays === 1) {
    return `Amanhã - ${dateFormatted}`;
  } else if (diffDays === -1) {
    return `Ontem - ${dateFormatted}`;
  } else if (diffDays > 1 && diffDays <= 7) {
    return `Em ${diffDays} dias - ${dateFormatted}`;
  } else if (diffDays < -1) {
    return `${Math.abs(diffDays)} dias atrás - ${dateFormatted}`;
  } else {
    return dateFormatted;
  }
}

// Toggle task completion
function toggleTaskComplete(index) {
  tasksData[index].completed = !tasksData[index].completed;
  tasksData[index].completedAt = tasksData[index].completed
    ? new Date().toISOString()
    : null;
  tasksData[index].updatedAt = new Date().toISOString();

  StorageManager.saveAllData();
  renderTasksTable();
  setupTasksEventListeners();
}

// Add a new task
function addTask() {
  showTaskModal();
}

// Edit an existing task
function editTask(index) {
  const task = tasksData[index];
  showTaskModal(task, index);
}

// Visualiza uma tarefa completa
function viewTask(index) {
  const task = tasksData[index];
  showViewTaskModal(task);
}

// Delete a task
function deleteTask(index) {
  const task = tasksData[index];
  if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
    tasksData.splice(index, 1);
    StorageManager.saveAllData();
    renderTasksTable();
    setupTasksEventListeners();
  }
}

// Mostra o modal de visualização da tarefa
function showViewTaskModal(task) {
  const existingModal = document.getElementById('viewTaskModal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'viewTaskModal';
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  const isOverdue = taskIsOverdue(task);
  const isDueSoon = taskIsDueSoon(task);

  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-semibold ${
            task.completed ? 'line-through' : ''
          }">${escapeHtml(task.title)}</h3>
          ${
            task.completed
              ? '<span class="text-green-600 dark:text-green-400">✓ Concluída</span>'
              : ''
          }
        </div>
        <button onclick="closeViewTaskModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ✕
        </button>
      </div>

      ${
        task.dueDate
          ? `
        <div class="mb-4 p-3 rounded-lg ${
          isOverdue
            ? 'bg-red-50 dark:bg-red-900/20'
            : isDueSoon
            ? 'bg-yellow-50 dark:bg-yellow-900/20'
            : 'bg-gray-50 dark:bg-gray-700'
        }">
          <p class="text-sm font-medium ${
            isOverdue
              ? 'text-red-600 dark:text-red-400'
              : isDueSoon
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-gray-600 dark:text-gray-400'
          }">
            ${isOverdue ? '⚠️ Atrasada - ' : isDueSoon ? '⏰ ' : '📅 '}
            Data limite: ${formatDueDate(task.dueDate)}
          </p>
        </div>
      `
          : ''
      }

      <div class="flex-1 overflow-y-auto mb-4">
        ${
          task.description
            ? `
          <div class="whitespace-pre-wrap break-words ${
            task.completed ? 'line-through' : ''
          }">${escapeHtml(task.description)}</div>
        `
            : '<p class="text-gray-500 dark:text-gray-400 italic">Sem descrição</p>'
        }
      </div>

      <div class="text-sm text-gray-600 dark:text-gray-400 border-t pt-4">
        <p>Criada em: ${formatDate(task.createdAt)}</p>
        ${
          task.updatedAt
            ? `<p>Atualizada em: ${formatDate(task.updatedAt)}</p>`
            : ''
        }
        ${
          task.completedAt
            ? `<p>Concluída em: ${formatDate(task.completedAt)}</p>`
            : ''
        }
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners para fechar o modal
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeViewTaskModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeViewTaskModal();
    }
  });
}

// Fecha o modal de visualização da tarefa
function closeViewTaskModal() {
  const modal = document.getElementById('viewTaskModal');
  if (modal) {
    modal.remove();
  }
}

// Show task modal
function showTaskModal(task = null, index = null) {
  const existingModal = document.getElementById('taskModal');
  if (existingModal) {
    existingModal.remove();
  }

  const isEditing = task !== null;
  const modal = document.createElement('div');
  modal.id = 'taskModal';
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  // Format date for input
  let dueDateValue = '';
  if (task && task.dueDate) {
    const date = new Date(task.dueDate);
    dueDateValue = date.toISOString().split('T')[0];
  }

  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
      <h3 class="text-lg font-semibold mb-4">
        ${isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
      </h3>

      <div class="flex-1 flex flex-col space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Título: <span class="text-red-500">*</span></label>
          <input type="text"
                 id="taskTitle"
                 value="${isEditing ? escapeHtml(task.title) : ''}"
                 placeholder="Digite o título da tarefa..."
                 maxlength="100"
                 class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Data Limite:</label>
          <input type="date"
                 id="taskDueDate"
                 value="${dueDateValue}"
                 min="${new Date().toISOString().split('T')[0]}"
                 class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
        </div>

        <div class="flex-1 flex flex-col">
          <label class="block text-sm font-medium mb-2">Descrição:</label>
          <textarea id="taskDescription"
                    placeholder="Digite a descrição da tarefa (opcional)..."
                    rows="6"
                    class="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 resize-none">${
                      isEditing && task.description
                        ? escapeHtml(task.description)
                        : ''
                    }</textarea>
        </div>

        ${
          isEditing && task.completed
            ? `
          <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <label class="flex items-center gap-2">
              <input type="checkbox" id="taskCompleted" checked class="w-5 h-5">
              <span class="text-sm font-medium text-green-700 dark:text-green-300">Tarefa concluída</span>
            </label>
          </div>
        `
            : ''
        }
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button onclick="closeTaskModal()"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          Cancelar
        </button>
        <button onclick="saveTask(${index})"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
          ${isEditing ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Focus on title input
  const titleInput = document.getElementById('taskTitle');
  titleInput.focus();

  // Event listeners
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTaskModal();
    }
    if (e.ctrlKey && e.key === 'Enter') {
      saveTask(index);
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeTaskModal();
    }
  });
}

// Save task
function saveTask(index = null) {
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  const dueDate = document.getElementById('taskDueDate').value;
  const completedCheckbox = document.getElementById('taskCompleted');

  if (!title) {
    alert('Por favor, digite um título para a tarefa.');
    document.getElementById('taskTitle').focus();
    return;
  }

  const now = new Date().toISOString();

  if (index !== null) {
    // Editing existing task
    tasksData[index] = {
      ...tasksData[index],
      title: title,
      description: description,
      dueDate: dueDate || null,
      updatedAt: now,
    };

    // Handle completion status if checkbox exists
    if (completedCheckbox) {
      const wasCompleted = tasksData[index].completed;
      tasksData[index].completed = completedCheckbox.checked;

      if (!wasCompleted && completedCheckbox.checked) {
        tasksData[index].completedAt = now;
      } else if (wasCompleted && !completedCheckbox.checked) {
        tasksData[index].completedAt = null;
      }
    }
  } else {
    // Creating new task
    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      dueDate: dueDate || null,
      completed: false,
      createdAt: now,
      updatedAt: null,
      completedAt: null,
    };
    tasksData.push(newTask);
  }

  StorageManager.saveAllData();
  closeTaskModal();
  renderTasksTable();
  setupTasksEventListeners();
}

// Close task modal
function closeTaskModal() {
  const modal = document.getElementById('taskModal');
  if (modal) {
    modal.remove();
  }
}

// Setup event listeners
function setupTasksEventListeners() {
  const addBtn = document.getElementById('addTaskBtn');
  if (addBtn) {
    const newAddBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAddBtn, addBtn);

    newAddBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      addTask();
    });
  }
}

// Clear all tasks
function clearAllTasks() {
  if (
    confirm(
      'Tem certeza que deseja excluir todas as tarefas? Esta ação não pode ser desfeita.'
    )
  ) {
    tasksData.length = 0;
    StorageManager.saveAllData();
    renderTasksTable();
    setupTasksEventListeners();
    alert('Todas as tarefas foram excluídas!');
  }
}

// Get tasks statistics for reports
function getTasksStats() {
  const total = tasksData.length;
  const completed = tasksData.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = tasksData.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
  ).length;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
  };
}

// Export functions for global use
window.addTask = addTask;
window.editTask = editTask;
window.viewTask = viewTask;
window.deleteTask = deleteTask;
window.saveTask = saveTask;
window.closeTaskModal = closeTaskModal;
window.closeViewTaskModal = closeViewTaskModal;
window.toggleTaskComplete = toggleTaskComplete;
window.clearAllTasks = clearAllTasks;
window.getTasksStats = getTasksStats;
