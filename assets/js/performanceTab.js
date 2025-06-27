// Initialize desempenho tab
function initDesempenhoTab() {
  const container = document.getElementById('desempenhoCards');
  if (!container) return;

  container.innerHTML = '';

  materias.forEach((materia) => {
    const data = performanceData[materia.nome];
    const card = document.createElement('div');
    card.className =
      'bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4';

    card.innerHTML = `
                <h4 class="font-semibold mb-3 text-sm">${materia.nome}</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Aulas:</span>
                        <input type="number" value="${
                          data.aulas
                        }" class="w-16 text-right bg-transparent border-none p-0 text-sm" onchange="updatePerformance('${
      materia.nome
    }', 'aulas', this.value)">
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Questões:</span>
                        <input type="number" value="${
                          data.questoes
                        }" class="w-16 text-right bg-transparent border-none p-0 text-sm" onchange="updatePerformance('${
      materia.nome
    }', 'questoes', this.value)">
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Acertos:</span>
                        <input type="number" value="${
                          data.acertos
                        }" class="w-16 text-right bg-transparent border-none p-0 text-sm" onchange="updatePerformance('${
      materia.nome
    }', 'acertos', this.value)">
                    </div>
                    <div class="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span>Desempenho:</span>
                        <span class="text-primary">${data.desempenho.toFixed(
                          1
                        )}%</span>
                    </div>
                </div>
            `;
    container.appendChild(card);
  });
}

function updatePerformance(materia, field, value) {
  performanceData[materia][field] = parseInt(value) || 0;

  // Recalculate performance
  const data = performanceData[materia];
  data.desempenho =
    data.questoes > 0 ? (data.acertos / data.questoes) * 100 : 0;

  // Refresh the display
  initDesempenhoTab();
  updateDashboardCards();
}
