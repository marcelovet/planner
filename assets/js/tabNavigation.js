// Tab navigation
function initTabs() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const mobileNavItems = document.querySelectorAll('.nav-mobile-item');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Update desktop nav
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

      // Update mobile nav
      mobileNavItems.forEach((item) => {
        if (item.getAttribute('data-tab') === targetTab) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Show/hide tab contents
      tabContents.forEach((content) => {
        content.classList.add('hidden');
      });

      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.classList.add('fade-in');
      }

      // Update FAB visibility for mobile
      if (window.updateFABVisibility) {
        updateFABVisibility(targetTab);
      }

      // Initialize tab content
      if (targetTab === 'dashboard') {
        initDashboard();
      } else if (targetTab === 'tempo') {
        initTempoTab();
      } else if (targetTab === 'desempenho') {
        initDesempenhoTab();
      } else if (targetTab === 'cronograma') {
        initCronogramaTab();
      } else if (targetTab === 'rotina') {
        initRotinaTab();
      } else if (targetTab === 'anotacoes') {
        initNotesTab();
      }

      // Scroll to top on mobile
      if (window.innerWidth <= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.tab) {
      const button = document.querySelector(`[data-tab="${e.state.tab}"]`);
      if (button) {
        button.click();
      }
    }
  });

  // Set initial state
  const firstTab = tabButtons[0];
  if (firstTab) {
    history.replaceState({ tab: firstTab.getAttribute('data-tab') }, '', '');
  }
}

// Add tab navigation to browser history
function addTabToHistory(tab) {
  history.pushState({ tab: tab }, '', '');
}
