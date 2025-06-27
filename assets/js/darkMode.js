// Dark mode toggle
function initDarkMode() {
  // Verifica se o navegador suporta detecção de preferência de tema
  // e se o usuário prefere o modo escuro
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    document.documentElement.classList.add('dark');
  }

  // Adiciona listener para mudanças na preferência do sistema
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

  // Adiciona funcionalidade ao botão de toggle manual
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}
