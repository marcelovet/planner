// Mobile enhancements
function initMobileEnhancements() {
  setupMobileNavigation();
  setupMobileMenu();
  setupFAB();
  setupSwipeGestures();
  setupMobileModals();
  improveTableResponsiveness();
  setupSwipeIndicators();
  setupSwipeTutorial();
  setupSwipeProgress();
}

// Setup mobile navigation
function setupMobileNavigation() {
  const mobileNavItems = document.querySelectorAll('.nav-mobile-item');
  const desktopNavItems = document.querySelectorAll('.nav-tab');

  mobileNavItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');

      // Update mobile nav active state
      mobileNavItems.forEach((navItem) => {
        navItem.classList.remove('active');
      });
      e.currentTarget.classList.add('active');

      // Update desktop nav active state
      desktopNavItems.forEach((navItem) => {
        if (navItem.getAttribute('data-tab') === tab) {
          navItem.click();
        }
      });

      // Update FAB visibility
      updateFABVisibility(tab);

      // Update swipe progress
      updateSwipeProgress();

      // Scroll to top on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Setup mobile dropdown menu
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDropdownMenu = document.getElementById('mobileDropdownMenu');

  if (mobileMenuBtn && mobileDropdownMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDropdownMenu.classList.toggle('hidden');
    });

    // Handle menu items
    const menuItems = mobileDropdownMenu.querySelectorAll('.mobile-menu-item');
    menuItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        mobileDropdownMenu.classList.add('hidden');

        switch (action) {
          case 'generateReport':
            generatePDFReport();
            break;
          case 'exportData':
            StorageManager.exportData();
            break;
          case 'importData':
            document.getElementById('importFileInput').click();
            break;
          case 'clearData':
            StorageManager.clearAllData();
            break;
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        !mobileMenuBtn.contains(e.target) &&
        !mobileDropdownMenu.contains(e.target)
      ) {
        mobileDropdownMenu.classList.add('hidden');
      }
    });
  }
}

// Setup floating action button
function setupFAB() {
  const fabContainer = document.getElementById('fabContainer');
  const fabButton = document.getElementById('fabButton');

  if (fabContainer && fabButton) {
    fabButton.addEventListener('click', () => {
      const activeTab = document
        .querySelector('.nav-mobile-item.active')
        .getAttribute('data-tab');

      switch (activeTab) {
        case 'tempo':
          addMateria();
          break;
        case 'anotacoes':
          addNote();
          break;
        default:
          break;
      }
    });
  }
}

// Update FAB visibility based on active tab
function updateFABVisibility(tab) {
  const fabContainer = document.getElementById('fabContainer');
  if (fabContainer) {
    if (tab === 'tempo' || tab === 'anotacoes') {
      fabContainer.style.display = 'block';
    } else {
      fabContainer.style.display = 'none';
    }
  }
}

// Setup swipe indicators
function setupSwipeIndicators() {
  // Create swipe indicators
  const leftIndicator = document.createElement('div');
  leftIndicator.className = 'swipe-indicator-left';
  leftIndicator.id = 'swipeIndicatorLeft';

  const rightIndicator = document.createElement('div');
  rightIndicator.className = 'swipe-indicator-right';
  rightIndicator.id = 'swipeIndicatorRight';

  document.body.appendChild(leftIndicator);
  document.body.appendChild(rightIndicator);

  // Show hint on first load
  if (!localStorage.getItem('swipeHintShown')) {
    setTimeout(() => {
      showSwipeHint();
      localStorage.setItem('swipeHintShown', 'true');
    }, 2000);
  }
}

// Show swipe hint animation
function showSwipeHint() {
  const mobileNavItems = document.querySelectorAll('.nav-mobile-item');
  const activeIndex = Array.from(mobileNavItems).findIndex((item) =>
    item.classList.contains('active')
  );

  const leftIndicator = document.getElementById('swipeIndicatorLeft');
  const rightIndicator = document.getElementById('swipeIndicatorRight');

  if (activeIndex > 0 && leftIndicator) {
    leftIndicator.classList.add('swipe-hint-right');
    setTimeout(() => {
      leftIndicator.classList.remove('swipe-hint-right');
    }, 2000);
  }

  if (activeIndex < mobileNavItems.length - 1 && rightIndicator) {
    rightIndicator.classList.add('swipe-hint-left');
    setTimeout(() => {
      rightIndicator.classList.remove('swipe-hint-left');
    }, 2000);
  }
}

// Setup swipe gestures for tab navigation
function setupSwipeGestures() {
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  let isSwiping = false;
  let swipeDirection = null;
  let isScrolling = false;
  let isHorizontalScroll = false;

  const SWIPE_THRESHOLD = 100; // Aumentado de 75 para 100
  const SWIPE_VELOCITY_THRESHOLD = 0.5; // pixels por millisegundo
  const VERTICAL_THRESHOLD = 50; // threshold para detectar scroll vertical
  const MIN_SWIPE_DISTANCE = 30; // distância mínima para começar a mostrar indicadores

  const handleSwipeStart = (e) => {
    // Verificar se o toque começou em um elemento scrollável horizontalmente
    const target = e.target;
    const scrollableParent = target.closest(
      '.table-mobile-scroll, .overflow-x-auto'
    );

    if (scrollableParent) {
      const hasHorizontalScroll =
        scrollableParent.scrollWidth > scrollableParent.clientWidth;
      if (hasHorizontalScroll) {
        isHorizontalScroll = true;
        return; // Não processar swipe se houver scroll horizontal
      }
    }

    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
    isSwiping = false;
    isScrolling = false;
    isHorizontalScroll = false;
    swipeDirection = null;
  };

  const handleSwipeMove = (e) => {
    if (!touchStartX || isHorizontalScroll) return;

    const currentX = e.changedTouches[0].screenX;
    const currentY = e.changedTouches[0].screenY;
    const diffX = touchStartX - currentX;
    const diffY = touchStartY - currentY;

    // Se ainda não determinou se é scroll ou swipe
    if (!isSwiping && !isScrolling) {
      // Se o movimento vertical é maior que o horizontal, é scroll
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
        isScrolling = true;
        return;
      }

      // Se o movimento horizontal é significativo, é swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        isSwiping = true;

        // Verificar se o elemento atual tem scroll horizontal
        const target = document.elementFromPoint(currentX, currentY);
        if (target) {
          const scrollableParent = target.closest(
            '.table-mobile-scroll, .overflow-x-auto'
          );
          if (
            scrollableParent &&
            scrollableParent.scrollWidth > scrollableParent.clientWidth
          ) {
            isSwiping = false;
            isHorizontalScroll = true;
            return;
          }
        }
      }
    }

    // Se está fazendo scroll vertical, não processar como swipe
    if (isScrolling) return;

    // Processar swipe apenas se o movimento horizontal é dominante
    if (isSwiping && Math.abs(diffX) > MIN_SWIPE_DISTANCE) {
      // Prevenir scroll da página durante o swipe
      if (Math.abs(diffX) > Math.abs(diffY) * 2) {
        e.preventDefault();
      }

      const mobileNavItems = document.querySelectorAll('.nav-mobile-item');
      const activeIndex = Array.from(mobileNavItems).findIndex((item) =>
        item.classList.contains('active')
      );

      const leftIndicator = document.getElementById('swipeIndicatorLeft');
      const rightIndicator = document.getElementById('swipeIndicatorRight');

      // Determine swipe direction and show indicators
      if (
        diffX > MIN_SWIPE_DISTANCE &&
        activeIndex < mobileNavItems.length - 1
      ) {
        // Swiping left (next tab)
        swipeDirection = 'left';
        if (rightIndicator) {
          rightIndicator.classList.add('show');
          // Opacidade baseada na distância, mas com um máximo
          const opacity = Math.min(
            (Math.abs(diffX) - MIN_SWIPE_DISTANCE) /
              (SWIPE_THRESHOLD - MIN_SWIPE_DISTANCE),
            1
          );
          rightIndicator.style.opacity = opacity;
        }
        if (leftIndicator) {
          leftIndicator.classList.remove('show');
        }
      } else if (diffX < -MIN_SWIPE_DISTANCE && activeIndex > 0) {
        // Swiping right (previous tab)
        swipeDirection = 'right';
        if (leftIndicator) {
          leftIndicator.classList.add('show');
          const opacity = Math.min(
            (Math.abs(diffX) - MIN_SWIPE_DISTANCE) /
              (SWIPE_THRESHOLD - MIN_SWIPE_DISTANCE),
            1
          );
          leftIndicator.style.opacity = opacity;
        }
        if (rightIndicator) {
          rightIndicator.classList.remove('show');
        }
      }
    }
  };

  const handleSwipeEnd = (e) => {
    if (isHorizontalScroll) {
      isHorizontalScroll = false;
      return;
    }

    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    const touchEndTime = Date.now();

    // Hide indicators
    const leftIndicator = document.getElementById('swipeIndicatorLeft');
    const rightIndicator = document.getElementById('swipeIndicatorRight');

    if (leftIndicator) {
      leftIndicator.classList.remove('show');
      leftIndicator.style.opacity = '';
    }
    if (rightIndicator) {
      rightIndicator.classList.remove('show');
      rightIndicator.style.opacity = '';
    }

    if (!isSwiping || isScrolling) {
      // Reset values
      touchStartX = 0;
      touchEndX = 0;
      touchStartY = 0;
      touchEndY = 0;
      isSwiping = false;
      isScrolling = false;
      swipeDirection = null;
      return;
    }

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const timeDiff = touchEndTime - touchStartTime;
    const velocity = Math.abs(diffX) / timeDiff;

    // Verificar se o swipe foi horizontal o suficiente
    if (Math.abs(diffX) < Math.abs(diffY) * 1.5) {
      // Reset values
      touchStartX = 0;
      touchEndX = 0;
      touchStartY = 0;
      touchEndY = 0;
      isSwiping = false;
      isScrolling = false;
      swipeDirection = null;
      return;
    }

    // Verificar threshold de distância E velocidade
    const hasEnoughDistance = Math.abs(diffX) > SWIPE_THRESHOLD;
    const hasEnoughVelocity = velocity > SWIPE_VELOCITY_THRESHOLD;

    if (
      hasEnoughDistance ||
      (hasEnoughVelocity && Math.abs(diffX) > SWIPE_THRESHOLD * 0.7)
    ) {
      const mobileNavItems = document.querySelectorAll('.nav-mobile-item');
      const activeIndex = Array.from(mobileNavItems).findIndex((item) =>
        item.classList.contains('active')
      );

      if (diffX > 0 && activeIndex < mobileNavItems.length - 1) {
        // Swipe left - next tab
        mobileNavItems[activeIndex + 1].click();

        // Vibrar se disponível
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      } else if (diffX < 0 && activeIndex > 0) {
        // Swipe right - previous tab
        mobileNavItems[activeIndex - 1].click();

        // Vibrar se disponível
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    }

    // Reset
    touchStartX = 0;
    touchEndX = 0;
    touchStartY = 0;
    touchEndY = 0;
    isSwiping = false;
    isScrolling = false;
    swipeDirection = null;
  };

  // Add touch listeners to main content area
  const main = document.querySelector('main');
  if (main) {
    main.addEventListener('touchstart', handleSwipeStart, { passive: true });
    main.addEventListener('touchmove', handleSwipeMove, { passive: false }); // passive: false para permitir preventDefault
    main.addEventListener('touchend', handleSwipeEnd, { passive: true });
    main.addEventListener('touchcancel', handleSwipeEnd, { passive: true });
  }
}

// Setup swipe tutorial
function setupSwipeTutorial() {
  // Check if tutorial has been shown
  if (localStorage.getItem('swipeTutorialShown')) return;

  // Create tutorial overlay
  const tutorial = document.createElement('div');
  tutorial.className = 'swipe-tutorial';
  tutorial.innerHTML = `
    <div class="swipe-tutorial-content">
      <div class="swipe-tutorial-animation">
        <div class="swipe-tutorial-arrows">
          <div class="swipe-tutorial-arrow left"></div>
          <div class="swipe-tutorial-arrow right"></div>
        </div>
        <div class="swipe-tutorial-hand"></div>
      </div>
      <h3 class="text-lg font-semibold mb-2">Deslize para navegar</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Deslize para a esquerda ou direita para alternar entre as abas
      </p>
      <button class="bg-primary text-white px-4 py-2 rounded-lg w-full">
        Entendi!
      </button>
    </div>
  `;

  document.body.appendChild(tutorial);

  // Show tutorial after a delay
  setTimeout(() => {
    tutorial.classList.add('show');
  }, 1500);

  // Handle close
  const closeButton = tutorial.querySelector('button');
  closeButton.addEventListener('click', () => {
    tutorial.classList.remove('show');
    setTimeout(() => {
      tutorial.remove();
    }, 300);
    localStorage.setItem('swipeTutorialShown', 'true');
  });

  // Also close on tap outside
  tutorial.addEventListener('click', (e) => {
    if (e.target === tutorial) {
      closeButton.click();
    }
  });
}

// Setup swipe progress dots
function setupSwipeProgress() {
  if (window.innerWidth > 768) return;

  const mobileNavItems = document.querySelectorAll('.nav-mobile-item');

  const progressContainer = document.createElement('div');
  progressContainer.className = 'swipe-progress';
  progressContainer.id = 'swipeProgress';

  mobileNavItems.forEach((item, index) => {
    const dot = document.createElement('div');
    dot.className = 'swipe-progress-dot';
    if (index === 0) dot.classList.add('active');
    progressContainer.appendChild(dot);
  });

  document.body.appendChild(progressContainer);
}

// Update swipe progress
function updateSwipeProgress() {
  const progressContainer = document.getElementById('swipeProgress');
  if (!progressContainer) return;

  const mobileNavItems = document.querySelectorAll('.nav-mobile-item');
  const dots = progressContainer.querySelectorAll('.swipe-progress-dot');

  const activeIndex = Array.from(mobileNavItems).findIndex((item) =>
    item.classList.contains('active')
  );

  dots.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Setup mobile-optimized modals
function setupMobileModals() {
  // Override modal creation to add mobile classes
  const originalShowNoteModal = window.showNoteModal;
  window.showNoteModal = function (note, index) {
    originalShowNoteModal(note, index);

    const modal = document.getElementById('noteModal');
    if (modal && window.innerWidth <= 768) {
      modal.classList.add('modal-mobile');

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Restore body scroll when modal closes
      const closeBtn = modal.querySelector('button[onclick*="closeNoteModal"]');
      if (closeBtn) {
        const originalOnclick = closeBtn.onclick;
        closeBtn.onclick = function () {
          document.body.style.overflow = '';
          if (originalOnclick) originalOnclick();
        };
      }
    }
  };

  // Same for other modals
  const originalShowEditModal = window.showEditModal;
  if (originalShowEditModal) {
    window.showEditModal = function (dia, horario, atividade) {
      originalShowEditModal(dia, horario, atividade);

      const modal = document.getElementById('editAtividadeModal');
      if (modal && window.innerWidth <= 768) {
        modal.classList.add('modal-mobile');
        document.body.style.overflow = 'hidden';
      }
    };
  }
}

// Improve table responsiveness
function improveTableResponsiveness() {
  // Add horizontal scroll indicators
  const tables = document.querySelectorAll('.table-mobile-scroll table');

  tables.forEach((table) => {
    const wrapper = table.closest('.table-mobile-scroll');
    if (wrapper) {
      wrapper.addEventListener('scroll', () => {
        const scrollLeft = wrapper.scrollLeft;
        const scrollWidth = wrapper.scrollWidth;
        const clientWidth = wrapper.clientWidth;

        if (scrollLeft > 0) {
          wrapper.classList.add('has-scroll-left');
        } else {
          wrapper.classList.remove('has-scroll-left');
        }

        if (scrollLeft + clientWidth < scrollWidth - 1) {
          wrapper.classList.add('has-scroll-right');
        } else {
          wrapper.classList.remove('has-scroll-right');
        }
      });

      // Trigger initial check
      wrapper.dispatchEvent(new Event('scroll'));
    }
  });
}

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    // Resize charts
    if (window.Plotly) {
      Plotly.Plots.resize('tempoChart');
      Plotly.Plots.resize('desempenhoChart');
    }

    // Update table scroll indicators
    improveTableResponsiveness();
  }, 300);
});

// Optimize touch interactions
document.addEventListener('DOMContentLoaded', () => {
  // Add touch feedback to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.addEventListener(
      'touchstart',
      () => {
        button.style.opacity = '0.8';
      },
      { passive: true }
    );

    button.addEventListener(
      'touchend',
      () => {
        setTimeout(() => {
          button.style.opacity = '';
        }, 100);
      },
      { passive: true }
    );
  });

  // Prevent double-tap zoom on buttons
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
});

// Export functions for global use
window.initMobileEnhancements = initMobileEnhancements;
window.updateFABVisibility = updateFABVisibility;
window.showSwipeHint = showSwipeHint;
window.updateSwipeProgress = updateSwipeProgress;
