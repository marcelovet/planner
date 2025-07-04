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

  // Ordenar matérias por tempo de estudo (maior para menor)
  const materiasSorted = [...materias].sort(
    (a, b) => a.pdfs * chPorAula - b.pdfs * chPorAula
  );

  // Calcular altura dinâmica baseada no número de disciplinas
  const isMobile = window.innerWidth <= 768;
  const barHeight = isMobile ? 30 : 35;
  const minHeight = isMobile ? 300 : 400;
  const calculatedHeight = Math.max(
    minHeight,
    materiasSorted.length * barHeight + 120
  );

  // Preparar dados para gráfico de barras horizontais (tempo)
  const tempoData = [
    {
      x: materiasSorted.map((m) => m.pdfs * chPorAula),
      y: materiasSorted.map((m) => m.nome),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: materiasSorted.map((m, index) => {
          // Gradiente de cores baseado na posição
          const hue = (index * 360) / materiasSorted.length;
          return `hsl(${hue}, 70%, 60%)`;
        }),
        line: {
          color: 'rgba(0,0,0,0.1)',
          width: 1,
        },
      },
      text: materiasSorted.map((m) => `${(m.pdfs * chPorAula).toFixed(1)}h`),
      textposition: 'outside',
      hovertemplate:
        '<b>%{y}</b><br>' +
        'Tempo: %{x:.1f}h<br>' +
        'PDFs: ' +
        materiasSorted
          .map((m) => m.pdfs)
          .join('|')
          .split('|')[materiasSorted.indexOf('%{y}')] +
        '<br>' +
        '<extra></extra>',
      textfont: {
        size: isMobile ? 10 : 12,
      },
    },
  ];

  const tempoLayout = {
    title: {
      text: 'Distribuição do Tempo por Disciplina',
      font: {
        size: isMobile ? 16 : 18,
      },
    },
    xaxis: {
      title: 'Horas de Estudo',
      tickformat: '.0f',
      zeroline: true,
      showgrid: true,
      gridcolor: 'rgba(128,128,128,0.2)',
    },
    yaxis: {
      title: '',
      automargin: true,
      tickfont: {
        size: isMobile ? 10 : 12,
      },
    },
    margin: {
      l: isMobile ? 10 : 20,
      r: isMobile ? 60 : 80,
      t: 50,
      b: 50,
      pad: 4,
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    height: calculatedHeight,
  };

  const config = {
    responsive: true,
    displayModeBar: false,
  };

  // Criar ou atualizar gráfico de tempo
  const tempoContainer = document.getElementById('tempoChart');
  if (tempoContainer) {
    // Ajustar altura do container
    tempoContainer.style.height = `${calculatedHeight}px`;
    tempoContainer.parentElement.style.minHeight = `${calculatedHeight + 50}px`;
    Plotly.newPlot('tempoChart', tempoData, tempoLayout, config);
  }

  // Preparar dados para gráfico de barras horizontais (desempenho)
  const desempenhoDataSorted = materiasSorted
    .map((m) => ({
      nome: m.nome,
      desempenho: (performanceData[m.nome] || { desempenho: 0 }).desempenho,
    }))
    .sort((a, b) => b.desempenho - a.desempenho);

  const desempenhoData = [
    {
      x: desempenhoDataSorted.map((m) => m.desempenho),
      y: desempenhoDataSorted.map((m) => m.nome),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: desempenhoDataSorted.map((m) => {
          // Cores baseadas no desempenho
          if (m.desempenho >= 80) return '#10B981'; // Verde
          if (m.desempenho >= 60) return '#F59E0B'; // Amarelo
          if (m.desempenho >= 40) return '#FB923C'; // Laranja
          return '#EF4444'; // Vermelho
        }),
        line: {
          color: 'rgba(0,0,0,0.1)',
          width: 1,
        },
      },
      text: desempenhoDataSorted.map((m) => `${m.desempenho.toFixed(1)}%`),
      textposition: 'outside',
      hovertemplate:
        '<b>%{y}</b><br>' + 'Desempenho: %{x:.1f}%<br>' + '<extra></extra>',
      textfont: {
        size: isMobile ? 10 : 12,
      },
    },
  ];

  const desempenhoLayout = {
    title: {
      text: 'Desempenho por Disciplina',
      font: {
        size: isMobile ? 16 : 18,
      },
    },
    xaxis: {
      title: 'Desempenho (%)',
      range: [0, 110],
      tickformat: '.0f',
      zeroline: true,
      showgrid: true,
      gridcolor: 'rgba(128,128,128,0.2)',
    },
    yaxis: {
      title: '',
      automargin: true,
      tickfont: {
        size: isMobile ? 10 : 12,
      },
    },
    margin: {
      l: isMobile ? 10 : 20,
      r: isMobile ? 60 : 80,
      t: 50,
      b: 50,
      pad: 4,
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    height: calculatedHeight,
    shapes: [
      {
        type: 'line',
        x0: 75,
        y0: -0.5,
        x1: 75,
        y1: desempenhoDataSorted.length - 0.5,
        line: {
          color: 'rgba(255, 0, 0, 0.3)',
          width: 2,
          dash: 'dash',
        },
      },
    ],
    annotations: [
      {
        x: 75,
        y: desempenhoDataSorted.length,
        text: 'Meta 75%',
        showarrow: false,
        font: {
          size: isMobile ? 10 : 12,
          color: 'rgba(255, 0, 0, 0.5)',
        },
        xanchor: 'center',
        yanchor: 'bottom',
      },
    ],
  };

  // Criar ou atualizar gráfico de desempenho
  const desempenhoContainer = document.getElementById('desempenhoChart');
  if (desempenhoContainer) {
    // Ajustar altura do container
    desempenhoContainer.style.height = `${calculatedHeight}px`;
    desempenhoContainer.parentElement.style.minHeight = `${
      calculatedHeight + 50
    }px`;
    Plotly.newPlot('desempenhoChart', desempenhoData, desempenhoLayout, config);
  }

  // Armazenar instâncias dos gráficos
  chartInstances.tempoChart = 'tempoChart';
  chartInstances.desempenhoChart = 'desempenhoChart';

  // Lidar com atualizações do modo escuro
  const isDarkMode = document.documentElement.classList.contains('dark');
  if (isDarkMode) {
    updateChartsForDarkMode();
  }
}

// Função para atualizar gráficos para modo escuro
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
      tickfont: {
        color: '#e5e7eb',
      },
      title: {
        font: {
          color: '#e5e7eb',
        },
      },
    },
    yaxis: {
      gridcolor: '#374151',
      zerolinecolor: '#374151',
      tickfont: {
        color: '#e5e7eb',
      },
    },
  };

  // Atualizar gráfico de tempo
  Plotly.relayout('tempoChart', darkModeLayout);

  // Atualizar gráfico de desempenho com propriedades adicionais
  const desempenhoLayout = {
    ...darkModeLayout,
    shapes: [
      {
        type: 'line',
        x0: 75,
        y0: -0.5,
        x1: 75,
        y1: materias.length - 0.5,
        line: {
          color: 'rgba(255, 100, 100, 0.3)',
          width: 2,
          dash: 'dash',
        },
      },
    ],
    annotations: [
      {
        x: 75,
        y: materias.length,
        text: 'Meta 75%',
        showarrow: false,
        font: {
          size: window.innerWidth <= 768 ? 10 : 12,
          color: 'rgba(255, 100, 100, 0.5)',
        },
        xanchor: 'center',
        yanchor: 'bottom',
      },
    ],
  };
  Plotly.relayout('desempenhoChart', desempenhoLayout);
}

// Adicionar event listener para toggle de modo escuro
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      setTimeout(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        if (isDarkMode) {
          updateChartsForDarkMode();
        } else {
          // Resetar para modo claro
          initCharts();
        }
      }, 100);
    });
  }
});

// Função para redimensionar gráficos quando a janela é redimensionada
window.addEventListener('resize', () => {
  // Pequeno delay para garantir que o layout foi atualizado
  setTimeout(() => {
    initCharts(); // Re-inicializar para ajustar ao novo tamanho
  }, 300);
});

// Função para lidar com mudança de orientação em dispositivos móveis
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    initCharts();
  }, 500);
});
