let chartInstances = {
  tempoChart: null,
  desempenhoChart: null,
};

// Dashboard functions
function initDashboard() {
  updateDashboardCards();
  initCharts();
}

function updateDashboardCards() {
  const chPorAula = parseFloat(
    document.getElementById('chPorAula')?.value || 6
  );
  const totalPdfs = materias.reduce((sum, m) => sum + m.pdfs, 0);
  const tempoTotal = totalPdfs * chPorAula * 1.5;

  const questoesTotal = Object.values(performanceData).reduce(
    (sum, p) => sum + p.questoes,
    0
  );
  const acertosTotal = Object.values(performanceData).reduce(
    (sum, p) => sum + p.acertos,
    0
  );
  const desempenhoMedio =
    questoesTotal > 0 ? ((acertosTotal / questoesTotal) * 100).toFixed(1) : 0;

  document.getElementById('tempoTotal').textContent = `${tempoTotal.toFixed(
    0
  )}h`;
  document.getElementById(
    'desempenhoMedio'
  ).textContent = `${desempenhoMedio}%`;
  document.getElementById('semanasEstudo').textContent = Math.ceil(
    tempoTotal / 42
  );
  document.getElementById('questoesFeitas').textContent = questoesTotal;
}

function initCharts() {
  const chPorAula = parseFloat(
    document.getElementById('chPorAula')?.value || 6
  );
  const materiasSorted = [...materias].sort(
    (a, b) => b.pdfs * chPorAula - a.pdfs * chPorAula
  );

  const ctx1 = document.getElementById('tempoChart');
  if (ctx1) {
    if (chartInstances.tempoChart) {
      chartInstances.tempoChart.data.labels = materiasSorted
        .slice(0, 8)
        .map((m) => m.nome);
      chartInstances.tempoChart.data.datasets[0].data = materiasSorted
        .slice(0, 8)
        .map((m) => m.pdfs * chPorAula);
      chartInstances.tempoChart.update();
    } else {
      chartInstances.tempoChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: materiasSorted.slice(0, 8).map((m) => m.nome),
          datasets: [
            {
              data: materiasSorted.slice(0, 8).map((m) => m.pdfs * chPorAula),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#C9CBCF',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    }
  }

  const ctx2 = document.getElementById('desempenhoChart');
  if (ctx2) {
    if (chartInstances.desempenhoChart) {
      chartInstances.desempenhoChart.data.labels = materiasSorted
        .slice(0, 8)
        .map((m) => m.nome.split(' ')[0]);
      chartInstances.desempenhoChart.data.datasets[0].data = materiasSorted
        .slice(0, 8)
        .map((m) => (performanceData[m.nome] || { desempenho: 0 }).desempenho);
      chartInstances.desempenhoChart.update();
    } else {
      chartInstances.desempenhoChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: materiasSorted.slice(0, 8).map((m) => m.nome.split(' ')[0]),
          datasets: [
            {
              label: 'Desempenho (%)',
              data: materiasSorted
                .slice(0, 8)
                .map(
                  (m) =>
                    (performanceData[m.nome] || { desempenho: 0 }).desempenho
                ),
              backgroundColor: '#5D5CDE',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        },
      });
    }
  }
}
