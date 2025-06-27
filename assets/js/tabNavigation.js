// Tab navigation
function initTabs() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

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

      button.classList.add('border-primary', 'text-primary');
      button.classList.remove(
        'border-transparent',
        'text-gray-500',
        'hover:text-gray-700',
        'dark:text-gray-400',
        'dark:hover:text-gray-300'
      );

      tabContents.forEach((content) => {
        content.classList.add('hidden');
      });

      document.getElementById(targetTab).classList.remove('hidden');
      document.getElementById(targetTab).classList.add('fade-in');

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
