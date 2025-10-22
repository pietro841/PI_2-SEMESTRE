document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // 1. DEFINIÇÃO DAS VARIÁVEIS
    // ===================================
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('btnToggleSidebar');
    const detalhesCollapse = document.getElementById('detalhes-colapso');
    const comandoTextarea = document.getElementById('comando-edicao-textarea');
    const menuLinks = document.querySelectorAll('.menu-link');


    // ===================================
    // 2. FUNÇÃO DE FECHAMENTO (CORRIGIDA)
    //    Usando o método estático para evitar instâncias desnecessárias.
    // ===================================
    function closeAllCollapses() {
        const openCollapses = document.querySelectorAll('.collapse.show');
        openCollapses.forEach(collapseElement => {
            // Verifica se o objeto Bootstrap está carregado
            if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {

                // *** CORREÇÃO: Usamos o método estático getOrCreateInstance para fechar de forma mais segura.
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, { toggle: false });
                bsCollapse.hide();
            }
        });
    }


    // ===============================================
    // 3. LISTENER PARA LIMPAR O TEXTAREA (MANTIDO)
    // ===============================================
    if (detalhesCollapse && comandoTextarea) {
        detalhesCollapse.addEventListener('hide.bs.collapse', function () {
            comandoTextarea.value = "";
            comandoTextarea.placeholder = "Girar, mudar cor, etc...";
        });
    }


    // ===============================================
    // 4. LÓGICA DO TOGGLE PRINCIPAL - FECHA TUDO E MINIMIZA (CORRIGIDO)
    // ===============================================
    toggleButton.addEventListener('click', function () {

        // Verifica o estado atual do sidebar
        const isExpanded = sidebar.classList.contains('expanded');

        if (isExpanded) {
            // AÇÃO: FECHAR
            closeAllCollapses();
            if (comandoTextarea) {
                comandoTextarea.blur();
            }
            // Alterna para minimized
            sidebar.classList.remove('expanded');
            sidebar.classList.add('minimized');
        } else {
            // AÇÃO: ABRIR
            // Alterna para expanded
            sidebar.classList.remove('minimized');
            sidebar.classList.add('expanded');
        }
    });


    // ===============================================
    // 5. LÓGICA DO CLIQUE NOS ITENS DO MENU (CORRIGIDA)
    //    Adiciona o comportamento de acordeão manual, mas de forma segura.
    // ===============================================
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {

            // 5a. Expande a sidebar se estiver minimizada
            if (sidebar.classList.contains('minimized')) {
                sidebar.classList.remove('minimized');
                sidebar.classList.add('expanded');
            }

            // 5b. Comportamento de Acordeão Manual: Fecha outros colapsos abertos.
            // Isso previne que vários itens fiquem abertos ao mesmo tempo.
            const targetId = link.getAttribute('data-bs-target');
            const targetElement = document.querySelector(targetId);

            menuLinks.forEach(otherLink => {
                const otherTargetId = otherLink.getAttribute('data-bs-target');
                const otherTargetElement = document.querySelector(otherTargetId);

                // Se o elemento alvo existe, não é o que clicamos, e está aberto, feche.
                if (otherTargetElement && otherTargetElement !== targetElement && otherTargetElement.classList.contains('show')) {
                    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(otherTargetElement, { toggle: false });
                        bsCollapse.hide();
                    }
                }
            });
            // O Bootstrap cuida de abrir/fechar o colapso clicado graças ao data-bs-toggle no HTML.
        });
    });


    // ===============================================
    // 6. ESTADO INICIAL (AJUSTADO PARA ABRIR NO MODO MINIMIZADO)
    // ===============================================
    if (sidebar) {
        // Garante que o estado inicial seja 'minimized' e que todos os colapsos estejam fechados
        sidebar.classList.remove('expanded');
        sidebar.classList.add('minimized');
        closeAllCollapses();
    }
});