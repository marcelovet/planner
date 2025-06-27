// Navegação das abas
function initTabs() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove estado ativo de todas as abas
      tabButtons.forEach((btn) => {
        btn.classList.remove('border-primary', 'text-primary');
        btn.classList.add(
          'border-transparent',
          'text-gray-500',
          'hover:text-gray-700',
          'dark:text-gray-400',
          'dark:hover:text-gray-300'
        );
      });

      // Adiciona estado ativo à aba clicada
      button.classList.add('border-primary', 'text-primary');
      button.classList.remove(
        'border-transparent',
        'text-gray-500',
        'hover:text-gray-700',
        'dark:text-gray-400',
        'dark:hover:text-gray-300'
      );

      // Esconde todos os conteúdos
      tabContents.forEach((content) => {
        content.classList.add('hidden');
      });

      // Mostra conteúdo da aba selecionada
      document.getElementById(targetTab).classList.remove('hidden');
      document.getElementById(targetTab).classList.add('fade-in');

      // Inicializa conteúdo específico da aba
      if (targetTab === 'dashboard') {
        initDashboard();
      } else if (targetTab === 'tempo') {
        initTempoTab();
      } else if (targetTab === 'desempenho') {
        initDesempenhoTab();
      } else if (targetTab === 'cronograma') {
        initCronogramaTab();
      }
    });
  });
}
