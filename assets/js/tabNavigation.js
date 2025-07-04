// Tab navigation atualizado
function initTabs() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const mobileNavTopItems = document.querySelectorAll(
    '.nav-mobile-top .nav-mobile-item'
  );
  const mobileNavBottomItems = document.querySelectorAll(
    '.nav-mobile-bottom .nav-mobile-item'
  );

  // Combinar todos os itens mobile
  const allMobileNavItems = [...mobileNavTopItems, ...mobileNavBottomItems];

  // Event listeners para botões desktop
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Event listeners para itens mobile
  allMobileNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  function switchTab(targetTab) {
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

    const activeDesktopTab = document.querySelector(
      `[data-tab="${targetTab}"].nav-tab`
    );
    if (activeDesktopTab) {
      activeDesktopTab.classList.add('border-primary', 'text-primary');
      activeDesktopTab.classList.remove(
        'border-transparent',
        'text-gray-500',
        'hover:text-gray-700',
        'dark:text-gray-400',
        'dark:hover:text-gray-300'
      );
    }

    // Update mobile nav
    allMobileNavItems.forEach((item) => {
      item.classList.remove('active');
    });

    const activeMobileTab = document.querySelector(
      `[data-tab="${targetTab}"].nav-mobile-item`
    );
    if (activeMobileTab) {
      activeMobileTab.classList.add('active');
    }

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
    } else if (targetTab === 'tarefas') {
      initTasksTab();
    }

    // Scroll to top on mobile
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Add to history
    addTabToHistory(targetTab);
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.tab) {
      switchTab(e.state.tab);
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
