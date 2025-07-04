// Chart helper functions
const ChartHelpers = {
  // Gerar cores para as disciplinas
  generateColors(count, type = 'gradient') {
    const colors = [];

    if (type === 'gradient') {
      for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count;
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
    } else if (type === 'performance') {
      // Cores baseadas em desempenho são geradas dinamicamente
    }

    return colors;
  },

  // Formatar labels para mobile
  formatLabel(label, maxLength = 20) {
    if (window.innerWidth <= 768) {
      maxLength = 15;
    }

    if (label.length > maxLength) {
      return label.substring(0, maxLength - 3) + '...';
    }
    return label;
  },

  // Obter configuração responsiva
  getResponsiveConfig() {
    const isMobile = window.innerWidth <= 768;

    return {
      fontSize: {
        title: isMobile ? 16 : 18,
        label: isMobile ? 10 : 12,
        tick: isMobile ? 10 : 12,
      },
      margin: {
        l: isMobile ? 10 : 20,
        r: isMobile ? 60 : 80,
        t: 50,
        b: 50,
      },
      barHeight: isMobile ? 30 : 35,
      minHeight: isMobile ? 300 : 400,
    };
  },

  // Exportar dados do gráfico
  exportChartData(chartId, format = 'png') {
    Plotly.downloadImage(chartId, {
      format: format,
      width: 1200,
      height: 800,
      filename: `grafico-${chartId}-${new Date().toISOString().split('T')[0]}`,
    });
  },
};

// Tornar disponível globalmente
window.ChartHelpers = ChartHelpers;
