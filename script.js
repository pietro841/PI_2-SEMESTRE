document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // 1. DEFINIÇÃO DAS VARIÁVEIS
    // ===================================
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('btnToggleSidebar');
    // Não precisamos mais de 'todosCollapses' e 'wasAnyCollapseOpen'
    const detalhesCollapse = document.getElementById('detalhes');
    const comandoTextarea = document.getElementById('comando-textarea'); // Variável para o textarea

    // ===================================
    // 2. FUNÇÃO DE FECHAMENTO (MANTIDA)
    // ===================================
    function closeAllCollapses() {
        // Encontra todos os elementos de colapso que estão atualmente abertos
        const openCollapses = document.querySelectorAll('.collapse.show');

        openCollapses.forEach(collapseElement => {
            if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                const bsCollapse = new bootstrap.Collapse(collapseElement, { toggle: false });
                bsCollapse.hide();
            }
        });
    }

    // ===============================================
    // 3. LISTENER PARA LIMPAR O TEXTAREA (ESSENCIAL)
    // ===============================================
    if (detalhesCollapse && comandoTextarea) {
        // Escuta o evento 'hide.bs.collapse' que dispara no INÍCIO do fechamento
        detalhesCollapse.addEventListener('hide.bs.collapse', function () {
            comandoTextarea.value = "";
            comandoTextarea.placeholder = "Detalhes ou Comando...";
        });
    }

    // ===================================
// 4. LÓGICA DO TOGGLE PRINCIPAL - FECHA IMEDIATAMENTE (COM CORREÇÃO DE FOCO)
// ===================================
toggleButton.addEventListener('click', function () {

    if (sidebar.classList.contains('expanded')) {

        closeAllCollapses();

        // 🟢 CORREÇÃO JS: Remove o foco do textarea antes de fechar o sidebar.
        // Isso elimina a borda que está vazando!
        if (comandoTextarea) {
            comandoTextarea.blur(); 
        }
        
        // Fecha o sidebar IMEDIATAMENTE.
        sidebar.classList.remove('expanded');
        sidebar.classList.add('minimized');

    } else {
        sidebar.classList.remove('minimized');
        sidebar.classList.add('expanded');
    }
});

    // Opcional: Garante que a sidebar comece no estado minimizado
    if (!sidebar.classList.contains('expanded') && !sidebar.classList.contains('minimized')) {
        sidebar.classList.add('minimized');
    }
});