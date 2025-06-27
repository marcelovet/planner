// Dados das matérias
// Array com informações de cada matéria do concurso
const materias = [];

// Performance data (simulada)
// Objeto para armazenar dados de desempenho (simulados)
let performanceData = {};
materias.forEach((materia) => {
  performanceData[materia.nome] = {
    aulas: 1,
    questoes: 1,
    acertos: 1,
    desempenho: 10,
  };
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initTabs();
  initDashboard();
  initTempoTab();
  initDesempenhoTab();
  initCronogramaTab();
});
