// Report Generator - Generates PDF reports
const { jsPDF } = window.jspdf;

function addCalculoTempoSection(doc, yPosition) {
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('1. Cálculo de Tempo para o Edital', 20, yPosition);
  yPosition += 15;

  const chPorAula = parseFloat(
    document.getElementById('chPorAula')?.value || 6
  );
  const chPorDia = parseFloat(document.getElementById('chPorDia')?.value || 6);
  const diasPorMes = parseFloat(
    document.getElementById('diasPorMes')?.value || 26
  );

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Configurações:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`• Carga horária por aula/PDF: ${chPorAula}h`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Carga horária por dia: ${chPorDia}h`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Dias de estudo por mês: ${diasPorMes}`, 25, yPosition);
  yPosition += 12;

  // Tabela de disciplinas
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Disciplinas:', 20, yPosition);
  yPosition += 8;

  // Cabeçalho da tabela
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('Disciplina', 25, yPosition);
  doc.text('PDFs', 100, yPosition);
  doc.text('CH Total', 130, yPosition);
  doc.text('Peso', 160, yPosition);
  yPosition += 6;

  // Linha separadora
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 4;

  // Dados das disciplinas
  doc.setFont(undefined, 'normal');
  let totalCH = 0;

  materias.forEach((materia) => {
    const chMateria = materia.pdfs * chPorAula;
    totalCH += chMateria;

    doc.text(
      materia.nome.substring(0, 25) + (materia.nome.length > 25 ? '...' : ''),
      25,
      yPosition
    );
    doc.text(materia.pdfs.toString(), 100, yPosition);
    doc.text(`${chMateria.toFixed(1)}h`, 130, yPosition);
    doc.text(materia.peso.toString(), 160, yPosition);
    yPosition += 6;
  });

  yPosition += 6;

  // Resumo dos cálculos
  const primeiraLeitura = totalCH;
  const revisoes = totalCH / 2;
  const total = primeiraLeitura + revisoes;
  const diasTotal = Math.ceil(total / chPorDia);
  const mesesTotal = Math.ceil(diasTotal / diasPorMes);
  const semanasTotal = Math.ceil(diasTotal / 7);

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Resumo:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`• Primeira leitura: ${primeiraLeitura.toFixed(0)}h`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Revisões: ${revisoes.toFixed(0)}h`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Total para o edital: ${total.toFixed(0)}h`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Dias necessários: ${diasTotal} dias`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Semanas necessárias: ${semanasTotal} semanas`, 25, yPosition);
  yPosition += 6;
  doc.text(
    `• Meses necessários: ${mesesTotal.toFixed(1)} meses`,
    25,
    yPosition
  );
  yPosition += 6;
  doc.text(`• Total de disciplinas: ${materias.length}`, 25, yPosition);

  return yPosition + 20;
}

function addDesempenhoSection(doc, yPosition) {
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('2. Controle de Desempenho', 20, yPosition);
  yPosition += 15;

  // Estatísticas gerais
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

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Estatísticas Gerais:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`• Total de questões feitas: ${questoesTotal}`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Total de acertos: ${acertosTotal}`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Desempenho médio: ${desempenhoMedio}%`, 25, yPosition);
  yPosition += 12;

  // Tabela de desempenho por disciplina
  if (materias.length > 0) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Desempenho por Disciplina:', 20, yPosition);
    yPosition += 8;

    // Cabeçalho da tabela
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Disciplina', 25, yPosition);
    doc.text('Aulas', 90, yPosition);
    doc.text('Questões', 120, yPosition);
    doc.text('Acertos', 150, yPosition);
    doc.text('Desempenho', 175, yPosition);
    yPosition += 6;

    // Linha separadora
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 4;

    // Dados das disciplinas
    doc.setFont(undefined, 'normal');
    materias.forEach((materia) => {
      const data = performanceData[materia.nome] || {
        aulas: 0,
        questoes: 0,
        acertos: 0,
        desempenho: 0,
      };

      doc.text(
        materia.nome.substring(0, 20) + (materia.nome.length > 20 ? '...' : ''),
        25,
        yPosition
      );
      doc.text(data.aulas.toString(), 90, yPosition);
      doc.text(data.questoes.toString(), 120, yPosition);
      doc.text(data.acertos.toString(), 150, yPosition);
      doc.text(`${data.desempenho.toFixed(1)}%`, 175, yPosition);
      yPosition += 6;
    });
  }

  return yPosition + 20;
}

function addRotinaSection(doc, yPosition) {
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('3. Minha Rotina Semanal', 20, yPosition);
  yPosition += 15;

  // Verificar se há dados de rotina
  if (!rotinaData || Object.keys(rotinaData).length === 0) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Nenhuma rotina configurada.', 25, yPosition);
    return yPosition + 20;
  }

  // Estatísticas da rotina
  const stats = getRotinaStats();

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Estatísticas da Rotina:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(
    `• Total de atividades programadas: ${stats.totalAtividades}`,
    25,
    yPosition
  );
  yPosition += 6;
  doc.text(
    `• Horas preenchidas: ${stats.horasPreenchidas} de ${stats.totalSlots}`,
    25,
    yPosition
  );
  yPosition += 6;
  doc.text(
    `• Percentual de ocupação: ${stats.percentualPreenchido}%`,
    25,
    yPosition
  );
  yPosition += 12;

  // Resumo por dia da semana
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Atividades por Dia da Semana:', 20, yPosition);
  yPosition += 8;

  const diasSemana = [
    { key: 'segunda', nome: 'Segunda-feira' },
    { key: 'terca', nome: 'Terça-feira' },
    { key: 'quarta', nome: 'Quarta-feira' },
    { key: 'quinta', nome: 'Quinta-feira' },
    { key: 'sexta', nome: 'Sexta-feira' },
    { key: 'sabado', nome: 'Sábado' },
    { key: 'domingo', nome: 'Domingo' },
  ];

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');

  diasSemana.forEach((dia) => {
    const atividades = stats.atividadesPorDia[dia.key] || 0;
    doc.text(`• ${dia.nome}: ${atividades} atividades`, 25, yPosition);
    yPosition += 6;
  });

  yPosition += 8;

  // Tabela condensada da rotina (principais atividades)
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Principais Atividades da Semana:', 20, yPosition);
  yPosition += 8;

  // Coletar todas as atividades únicas
  const atividadesUnicas = new Set();
  Object.keys(rotinaData).forEach((dia) => {
    Object.keys(rotinaData[dia]).forEach((horario) => {
      const atividade = rotinaData[dia][horario].atividade;
      if (atividade && atividade.trim()) {
        atividadesUnicas.add(atividade.trim());
      }
    });
  });

  if (atividadesUnicas.size > 0) {
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    const atividadesArray = Array.from(atividadesUnicas).slice(0, 20); // Limitar a 20 atividades
    atividadesArray.forEach((atividade, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('3. Minha Rotina Semanal (continuação)', 20, yPosition);
        yPosition += 15;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
      }

      doc.text(`• ${atividade}`, 25, yPosition);
      yPosition += 5;
    });

    if (atividadesUnicas.size > 20) {
      yPosition += 3;
      doc.text(
        `... e mais ${atividadesUnicas.size - 20} atividades`,
        25,
        yPosition
      );
    }
  } else {
    doc.setFontSize(10);
    doc.text('Nenhuma atividade específica configurada.', 25, yPosition);
  }

  return yPosition + 20;
}

function addNotesSection(doc, yPosition) {
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('4. Minhas Anotações', 20, yPosition);
  yPosition += 15;

  // Verificar se há anotações
  if (!notesData || notesData.length === 0) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Nenhuma anotação cadastrada.', 25, yPosition);
    return yPosition + 20;
  }

  // Estatísticas das anotações
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Estatísticas das Anotações:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`• Total de anotações: ${notesData.length}`, 25, yPosition);
  yPosition += 6;

  // Calcular estatísticas
  const totalCaracteres = notesData.reduce(
    (sum, note) => sum + note.content.length,
    0
  );
  const mediaCaracteres = Math.round(totalCaracteres / notesData.length);

  doc.text(
    `• Média de caracteres por anotação: ${mediaCaracteres}`,
    25,
    yPosition
  );
  yPosition += 6;

  // Data da última anotação
  if (notesData.length > 0) {
    const ultimaAnotacao = notesData.reduce((latest, note) => {
      const noteDate = new Date(note.updatedAt || note.createdAt);
      const latestDate = new Date(latest.updatedAt || latest.createdAt);
      return noteDate > latestDate ? note : latest;
    });

    const dataFormatada = new Date(
      ultimaAnotacao.updatedAt || ultimaAnotacao.createdAt
    ).toLocaleDateString('pt-BR');
    doc.text(`• Última atualização: ${dataFormatada}`, 25, yPosition);
    yPosition += 12;
  }

  // Listar todas as anotações
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Lista de Anotações:', 20, yPosition);
  yPosition += 8;

  notesData.forEach((note, index) => {
    // Verificar se precisa de nova página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('4. Minhas Anotações (continuação)', 20, yPosition);
      yPosition += 15;
    }

    // Título da anotação
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    const titulo = `${index + 1}. ${note.title}`;
    doc.text(titulo, 25, yPosition);
    yPosition += 8;

    // Data da anotação
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const dataAnotacao = new Date(note.createdAt).toLocaleDateString('pt-BR');
    doc.text(`Criado em: ${dataAnotacao}`, 25, yPosition);

    if (note.updatedAt) {
      const dataAtualizacao = new Date(note.updatedAt).toLocaleDateString(
        'pt-BR'
      );
      doc.text(`| Atualizado em: ${dataAtualizacao}`, 85, yPosition);
    }
    yPosition += 8;

    // Conteúdo da anotação
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    // Quebrar o texto em linhas para caber na página
    const maxLineWidth = 165; // largura máxima em pontos
    const lines = doc.splitTextToSize(note.content, maxLineWidth);

    lines.forEach((line) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 25, yPosition);
      yPosition += 5;
    });

    yPosition += 8; // Espaço entre anotações

    // Linha separadora (exceto na última anotação)
    if (index < notesData.length - 1) {
      doc.line(25, yPosition, 185, yPosition);
      yPosition += 8;
    }
  });

  return yPosition + 20;
}

function addTasksSection(doc, yPosition) {
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('5. Minhas Tarefas', 20, yPosition);
  yPosition += 15;

  // Verificar se há tarefas
  if (!tasksData || tasksData.length === 0) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Nenhuma tarefa cadastrada.', 25, yPosition);
    return yPosition + 20;
  }

  // Estatísticas das tarefas
  const stats = getTasksStats();

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Estatísticas das Tarefas:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`• Total de tarefas: ${stats.total}`, 25, yPosition);
  yPosition += 6;
  doc.text(
    `• Tarefas concluídas: ${stats.completed} (${stats.completionRate}%)`,
    25,
    yPosition
  );
  yPosition += 6;
  doc.text(`• Tarefas pendentes: ${stats.pending}`, 25, yPosition);
  yPosition += 6;
  doc.text(`• Tarefas em atraso: ${stats.overdue}`, 25, yPosition);
  yPosition += 12;

  // Listar tarefas pendentes
  const pendingTasks = tasksData.filter((t) => !t.completed);
  if (pendingTasks.length > 0) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Tarefas Pendentes:', 20, yPosition);
    yPosition += 8;

    pendingTasks.forEach((task, index) => {
      // Verificar se precisa de nova página
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('5. Minhas Tarefas (continuação)', 20, yPosition);
        yPosition += 15;
      }

      // Título da tarefa
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      const titulo = `${index + 1}. ${task.title}`;
      doc.text(titulo, 25, yPosition);
      yPosition += 6;

      // Data limite
      if (task.dueDate) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const dueDate = new Date(task.dueDate);
        const isOverdue = dueDate < new Date();
        const dueDateText = `Data limite: ${dueDate.toLocaleDateString(
          'pt-BR'
        )}${isOverdue ? ' (ATRASADA)' : ''}`;

        if (isOverdue) {
          doc.setTextColor(255, 0, 0); // Vermelho para tarefas atrasadas
        }
        doc.text(dueDateText, 25, yPosition);
        doc.setTextColor(0, 0, 0); // Volta para preto
        yPosition += 6;
      }

      // Descrição da tarefa
      if (task.description) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const maxLineWidth = 165;
        const lines = doc.splitTextToSize(task.description, maxLineWidth);

        lines.forEach((line) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 25, yPosition);
          yPosition += 5;
        });
      }

      yPosition += 4; // Espaço entre tarefas
    });
  }

  // Listar tarefas concluídas (resumo)
  const completedTasks = tasksData.filter((t) => t.completed);
  if (completedTasks.length > 0) {
    yPosition += 8;

    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Tarefas Concluídas:', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    completedTasks.slice(0, 10).forEach((task) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }

      const completedDate = task.completedAt
        ? ` - Concluída em ${new Date(task.completedAt).toLocaleDateString(
            'pt-BR'
          )}`
        : '';
      doc.text(`• ${task.title}${completedDate}`, 25, yPosition);
      yPosition += 5;
    });

    if (completedTasks.length > 10) {
      yPosition += 3;
      doc.text(
        `... e mais ${completedTasks.length - 10} tarefas concluídas`,
        25,
        yPosition
      );
    }
  }

  return yPosition + 20;
}

function getRotinaStats() {
  if (!rotinaData || Object.keys(rotinaData).length === 0) {
    return {
      totalAtividades: 0,
      horasPreenchidas: 0,
      totalSlots: 126, // 18 horas × 7 dias
      percentualPreenchido: 0,
      atividadesPorDia: {},
    };
  }

  let totalAtividades = 0;
  let horasPreenchidas = 0;
  const atividadesPorDia = {};

  const diasSemana = [
    'segunda',
    'terca',
    'quarta',
    'quinta',
    'sexta',
    'sabado',
    'domingo',
  ];
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

  diasSemana.forEach((dia) => {
    atividadesPorDia[dia] = 0;
    if (rotinaData[dia]) {
      horariosDisponiveis.forEach((horario) => {
        if (rotinaData[dia][horario] && rotinaData[dia][horario].atividade) {
          totalAtividades++;
          horasPreenchidas++;
          atividadesPorDia[dia]++;
        }
      });
    }
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

// modal de progresso
function showProgressModal() {
  const modal = document.createElement('div');
  modal.id = 'progressModal';
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-semibold mb-4 text-center">Gerando Relatório</h3>
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      <p class="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Por favor, aguarde...
      </p>
    </div>
  `;

  document.body.appendChild(modal);

  return modal;
}

function hideProgressModal(modal) {
  if (modal) {
    document.body.removeChild(modal);
  }
}

async function generatePDFReport() {
  const progressModal = showProgressModal();

  try {
    // Pequeno delay para mostrar o modal
    await new Promise((resolve) => setTimeout(resolve, 100));

    const doc = new jsPDF();
    let yPosition = 20;

    // Configurações do documento
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Relatório de Controle de Estudos', 20, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString(
        'pt-BR'
      )} às ${new Date().toLocaleTimeString('pt-BR')}`,
      20,
      yPosition
    );

    yPosition += 20;

    // Seção 1: Cálculo de Tempo
    yPosition = addCalculoTempoSection(doc, yPosition);

    // Verificar se precisa de nova página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Seção 2: Desempenho
    yPosition = addDesempenhoSection(doc, yPosition);

    // Verificar se precisa de nova página para a rotina
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    // Seção 3: Minha Rotina
    yPosition = addRotinaSection(doc, yPosition);

    // Verificar se precisa de nova página para as anotações
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    // Seção 4: Anotações
    yPosition = addNotesSection(doc, yPosition);

    // Verificar se precisa de nova página para as tarefas
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    // Seção 5: Tarefas
    yPosition = addTasksSection(doc, yPosition);

    // Salvar o PDF
    const fileName = `relatorio-estudos-${
      new Date().toISOString().split('T')[0]
    }.pdf`;
    doc.save(fileName);

    hideProgressModal(progressModal);

    // Mostrar mensagem de sucesso
    alert('Relatório PDF gerado com sucesso!');
  } catch (error) {
    hideProgressModal(progressModal);
    console.error('Erro ao gerar relatório:', error);
    alert('Erro ao gerar o relatório. Tente novamente.');
  }
}

// Exportar função para uso global
window.generatePDFReport = generatePDFReport;
