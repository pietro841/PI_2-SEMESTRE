document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTOS DA SIDEBAR DO USUÁRIO ===
    const btnUsuario = document.getElementById('btnUsuario');
    const sidebarUsuario = document.getElementById('sidebarUsuario');
    const btnCloseUser = document.getElementById('btnCloseUser');
    const sidebar = document.getElementById('sidebar'); 
    const allCollapseToggles = document.querySelectorAll('[data-bs-toggle="collapse"]');

    // Nomes de classes únicos para evitar conflitos
    const OPEN_CLASS = 'open-user';
    // Função para alternar a classe de abertura
    function toggleSidebarUsuario() {
        if (sidebarUsuario) {
            sidebarUsuario.classList.toggle(OPEN_CLASS);
        }
    }

    // 1. Abrir/Fechar ao clicar no botão principal
    if (btnUsuario) {
        btnUsuario.addEventListener('click', (event) => {
            // Impedimos que o evento de clique "vaze" e feche a sidebar imediatamente (ver ponto 3)
            event.stopPropagation();
            toggleSidebarUsuario();
        });
    }

    // 2. Fechar ao clicar no botão 'X' (mais usado em mobile)
    if (btnCloseUser) {
        btnCloseUser.addEventListener('click', toggleSidebarUsuario);
    }

    // 3. Fechar a sidebar se o usuário clicar FORA dela
    document.addEventListener('click', (event) => {
        // Verifica se a sidebar está aberta E se o clique não foi:
        // a) dentro da própria sidebar E
        // b) no botão que a abre

        const isClickInsideSidebar = sidebarUsuario && sidebarUsuario.contains(event.target);
        const isClickOnUserButton = btnUsuario && btnUsuario.contains(event.target);

        if (sidebarUsuario && sidebarUsuario.classList.contains(OPEN_CLASS) && !isClickInsideSidebar && !isClickOnUserButton) {
            toggleSidebarUsuario();
        }
    });
    allCollapseToggles.forEach(link => {
        link.addEventListener('click', function (e) {

            // 6a. Expande a sidebar se estiver minimizada
            if (sidebar.classList.contains('minimized')) {
                sidebar.classList.remove('minimized');
                sidebar.classList.add('expanded');
            }

            // Lógica de Acordeão Manual (restante do seu código)
            const targetId = link.getAttribute('data-bs-target');
            const targetElement = document.querySelector(targetId);

            allCollapseToggles.forEach(otherLink => {
                const otherTargetId = otherLink.getAttribute('data-bs-target');
                const otherTargetElement = document.querySelector(otherTargetId);

                if (otherTargetElement && otherTargetElement !== targetElement && otherTargetElement.classList.contains('show')) {

                    const isAncestor = otherTargetElement.contains(targetElement);

                    if (!isAncestor) {

                        const isSameLevel = link.closest('.collapse') === otherLink.closest('.collapse') || link.closest('.menu-principal') === otherLink.closest('.menu-principal');

                        if (isSameLevel) {
                            if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(otherTargetElement, { toggle: false });
                                bsCollapse.hide();
                            }
                        }
                    }
                }
            });

        }); 
    }); 

});