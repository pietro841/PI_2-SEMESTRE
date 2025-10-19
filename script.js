document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('btnToggleSidebar');

    // Remove a classe 'expanded' do HTML se for um estado padrão inicial
    // e adiciona a classe 'expanded' ou 'minimized' baseada na sua preferência inicial.
    // Vamos garantir que ele comece como expandido:
    sidebar.classList.add('expanded'); 

    toggleButton.addEventListener('click', function() {
        if (sidebar.classList.contains('expanded')) {
            // Se estiver expandido, minimiza
            sidebar.classList.remove('expanded');
            sidebar.classList.add('minimized');
        } else {
            // Se estiver minimizado, expande
            sidebar.classList.remove('minimized');
            sidebar.classList.add('expanded');
        }
    });
});