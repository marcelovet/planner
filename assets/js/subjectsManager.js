function addMateria() {
  const novaMateria = {
    nome: 'Nova Disciplina',
    pdfs: 1,
    peso: 1,
  };

  materias.push(novaMateria);

  // Adiciona dados de desempenho zerados
  performanceData[novaMateria.nome] = {
    aulas: 0,
    questoes: 0,
    acertos: 0,
    desempenho: 0,
  };

  renderMaterias();
  updateDashboardCards();
}

function removeMateria(index) {
  if (materias.length <= 1) {
    alert('Deve haver pelo menos uma disciplina!');
    return;
  }

  const materia = materias[index];
  if (confirm(`Tem certeza que deseja remover "${materia.nome}"?`)) {
    delete performanceData[materia.nome];
    materias.splice(index, 1);
    renderMaterias();
    updateDashboardCards();
    initDesempenhoTab();
  }
}

function updateMateria(index, field, value) {
  const oldName = materias[index].nome;

  if (field === 'nome') {
    materias[index][field] = value;
    // Atualiza chave no objeto de performance
    if (performanceData[oldName] && value !== oldName) {
      performanceData[value] = performanceData[oldName];
      delete performanceData[oldName];
    }
  } else {
    materias[index][field] = parseFloat(value) || 0;
  }

  renderMaterias();
  updateDashboardCards();
}
