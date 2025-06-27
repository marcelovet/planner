// let chartInstances = {
//   tempoChart: null,
//   desempenhoChart: null,
// };

// // Dashboard functions
// function initDashboard() {
//   updateDashboardCards();
//   initCharts();
// }

// function updateDashboardCards() {
//   const chPorAula = parseFloat(
//     document.getElementById('chPorAula')?.value || 6
//   );
//   const totalPdfs = materias.reduce((sum, m) => sum + m.pdfs, 0);
//   const tempoTotal = totalPdfs * chPorAula * 1.5;

//   const questoesTotal = Object.values(performanceData).reduce(
//     (sum, p) => sum + p.questoes,
//     0
//   );
//   const acertosTotal = Object.values(performanceData).reduce(
//     (sum, p) => sum + p.acertos,
//     0
//   );
//   const desempenhoMedio =
//     questoesTotal > 0 ? ((acertosTotal / questoesTotal) * 100).toFixed(1) : 0;

//   let totalCH = 0;
//   materias.forEach((materia, index) => {
//     const chMateria = materia.pdfs * chPorAula;
//     totalCH += chMateria;
//   });

//   const chPorDia = parseFloat(document.getElementById('chPorDia').value || 6);
//   const primeiraLeitura = totalCH;
//   const revisoes = totalCH / 2;
//   const total = primeiraLeitura + revisoes;
//   const diasTotal = Math.ceil(total / chPorDia);
//   const semanasTotal = Math.ceil(diasTotal / 7);

//   document.getElementById('tempoTotal').textContent = `${tempoTotal.toFixed(
//     0
//   )}h`;
//   document.getElementById(
//     'desempenhoMedio'
//   ).textContent = `${desempenhoMedio}%`;
//   document.getElementById('semanasEstudo').textContent = semanasTotal;
//   document.getElementById('questoesFeitas').textContent = questoesTotal;
// }

// function initCharts() {
//   const chPorAula = parseFloat(
//     document.getElementById('chPorAula')?.value || 6
//   );
//   const materiasSorted = [...materias].sort(
//     (a, b) => b.pdfs * chPorAula - a.pdfs * chPorAula
//   );

//   const ctx1 = document.getElementById('tempoChart');
//   if (ctx1) {
//     if (chartInstances.tempoChart) {
//       chartInstances.tempoChart.data.labels = materiasSorted
//         .slice(0, 8)
//         .map((m) => m.nome);
//       chartInstances.tempoChart.data.datasets[0].data = materiasSorted
//         .slice(0, 8)
//         .map((m) => m.pdfs * chPorAula);
//       chartInstances.tempoChart.update();
//     } else {
//       chartInstances.tempoChart = new Chart(ctx1, {
//         type: 'doughnut',
//         data: {
//           labels: materiasSorted.slice(0, 8).map((m) => m.nome),
//           datasets: [
//             {
//               data: materiasSorted.slice(0, 8).map((m) => m.pdfs * chPorAula),
//               backgroundColor: [
//                 '#FF6384',
//                 '#36A2EB',
//                 '#FFCE56',
//                 '#4BC0C0',
//                 '#9966FF',
//                 '#FF9F40',
//                 '#FF6384',
//                 '#C9CBCF',
//               ],
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               position: 'bottom',
//             },
//           },
//         },
//       });
//     }
//   }

//   const ctx2 = document.getElementById('desempenhoChart');
//   if (ctx2) {
//     if (chartInstances.desempenhoChart) {
//       chartInstances.desempenhoChart.data.labels = materiasSorted
//         .slice(0, 8)
//         .map((m) => m.nome.split(' ')[0]);
//       chartInstances.desempenhoChart.data.datasets[0].data = materiasSorted
//         .slice(0, 8)
//         .map((m) => (performanceData[m.nome] || { desempenho: 0 }).desempenho);
//       chartInstances.desempenhoChart.update();
//     } else {
//       chartInstances.desempenhoChart = new Chart(ctx2, {
//         type: 'bar',
//         data: {
//           labels: materiasSorted.slice(0, 8).map((m) => m.nome.split(' ')[0]),
//           datasets: [
//             {
//               label: 'Desempenho (%)',
//               data: materiasSorted
//                 .slice(0, 8)
//                 .map(
//                   (m) =>
//                     (performanceData[m.nome] || { desempenho: 0 }).desempenho
//                 ),
//               backgroundColor: '#5D5CDE',
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           scales: {
//             y: {
//               beginAtZero: true,
//               max: 100,
//             },
//           },
//         },
//       });
//     }
//   }
// }

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

  let totalCH = 0;
  materias.forEach((materia, index) => {
    const chMateria = materia.pdfs * chPorAula;
    totalCH += chMateria;
  });

  const chPorDia = parseFloat(document.getElementById('chPorDia').value || 6);
  const primeiraLeitura = totalCH;
  const revisoes = totalCH / 2;
  const total = primeiraLeitura + revisoes;
  const diasTotal = Math.ceil(total / chPorDia);
  const semanasTotal = Math.ceil(diasTotal / 7);

  document.getElementById('tempoTotal').textContent = `${tempoTotal.toFixed(
    0
  )}h`;
  document.getElementById(
    'desempenhoMedio'
  ).textContent = `${desempenhoMedio}%`;
  document.getElementById('semanasEstudo').textContent = semanasTotal;
  document.getElementById('questoesFeitas').textContent = questoesTotal;
}

function initCharts() {
  const chPorAula = parseFloat(
    document.getElementById('chPorAula')?.value || 6
  );
  const materiasSorted = [...materias].sort(
    (a, b) => b.pdfs * chPorAula - a.pdfs * chPorAula
  );

  // Prepare data for pie chart (tempo distribution)
  const pieData = [
    {
      values: materiasSorted.slice(0, 8).map((m) => m.pdfs * chPorAula),
      labels: materiasSorted.slice(0, 8).map((m) => m.nome),
      type: 'pie',
      hole: 0.4, // Creates a donut chart
      marker: {
        colors: [
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
      textinfo: 'label+percent',
      textposition: 'outside',
      hovertemplate:
        '<b>%{label}</b><br>' +
        'Tempo: %{value:.1f}h<br>' +
        'Percentual: %{percent}<br>' +
        '<extra></extra>',
    },
  ];

  const pieLayout = {
    title: {
      text: 'Distribuição do Tempo por Matéria',
      font: {
        size: 18,
      },
    },
    showlegend: true,
    legend: {
      orientation: 'v',
      x: 1,
      y: 0.5,
    },
    margin: {
      l: 0,
      r: 150,
      t: 50,
      b: 0,
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
  };

  const pieConfig = {
    responsive: true,
    displayModeBar: false,
  };

  // Create or update pie chart
  const pieContainer = document.getElementById('tempoChart');
  if (pieContainer) {
    Plotly.newPlot('tempoChart', pieData, pieLayout, pieConfig);
  }

  // Prepare data for bar chart (performance)
  const barData = [
    {
      x: materiasSorted.slice(0, 8).map((m) => m.nome.split(' ')[0]),
      y: materiasSorted
        .slice(0, 8)
        .map((m) => (performanceData[m.nome] || { desempenho: 0 }).desempenho),
      type: 'bar',
      marker: {
        color: '#5D5CDE',
        line: {
          color: '#4A49B8',
          width: 1,
        },
      },
      text: materiasSorted
        .slice(0, 8)
        .map(
          (m) =>
            `${(
              performanceData[m.nome] || { desempenho: 0 }
            ).desempenho.toFixed(1)}%`
        ),
      textposition: 'outside',
      hovertemplate:
        '<b>%{x}</b><br>' + 'Desempenho: %{y:.1f}%<br>' + '<extra></extra>',
    },
  ];

  const barLayout = {
    title: {
      text: 'Desempenho por Matéria',
      font: {
        size: 18,
      },
    },
    xaxis: {
      title: 'Matéria',
      tickangle: -45,
    },
    yaxis: {
      title: 'Desempenho (%)',
      range: [0, 110], // Slightly higher than 100 to show text on top
      tickformat: '.0f',
    },
    margin: {
      l: 60,
      r: 30,
      t: 50,
      b: 100,
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    bargap: 0.2,
  };

  const barConfig = {
    responsive: true,
    displayModeBar: false,
  };

  // Create or update bar chart
  const barContainer = document.getElementById('desempenhoChart');
  if (barContainer) {
    Plotly.newPlot('desempenhoChart', barData, barLayout, barConfig);
  }

  // Store chart instances for potential future use
  chartInstances.tempoChart = 'tempoChart';
  chartInstances.desempenhoChart = 'desempenhoChart';

  // Handle dark mode updates
  const isDarkMode = document.documentElement.classList.contains('dark');
  if (isDarkMode) {
    updateChartsForDarkMode();
  }
}

// Function to update charts for dark mode
function updateChartsForDarkMode() {
  const darkModeLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      color: '#e5e7eb', // gray-200 in Tailwind
    },
    xaxis: {
      gridcolor: '#374151', // gray-700 in Tailwind
      zerolinecolor: '#374151',
    },
    yaxis: {
      gridcolor: '#374151',
      zerolinecolor: '#374151',
    },
  };

  // Update tempo chart
  Plotly.relayout('tempoChart', darkModeLayout);

  // Update desempenho chart with additional axis properties
  const desempenhoLayout = {
    ...darkModeLayout,
    xaxis: {
      ...darkModeLayout.xaxis,
      title: 'Matéria',
      tickangle: -45,
    },
    yaxis: {
      ...darkModeLayout.yaxis,
      title: 'Desempenho (%)',
      range: [0, 110],
      tickformat: '.0f',
    },
  };
  Plotly.relayout('desempenhoChart', desempenhoLayout);
}

// Add event listener for dark mode toggle to update charts
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      setTimeout(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        if (isDarkMode) {
          updateChartsForDarkMode();
        } else {
          // Reset to light mode
          initCharts();
        }
      }, 100);
    });
  }
});

// Function to resize charts when window resizes
window.addEventListener('resize', () => {
  Plotly.Plots.resize('tempoChart');
  Plotly.Plots.resize('desempenhoChart');
});
