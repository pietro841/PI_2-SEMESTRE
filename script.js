document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos da Sidebar
    const btnMaterias = document.getElementById('materias'); 
    const submenuMaterias = document.getElementById('submenu-materias'); 
    
    const btnEstilos = document.getElementById('estilos'); 
    const submenuEstilos = document.getElementById('submenu-estilos'); 
    
    const btnDetalhes = document.getElementById('detalhes'); 
    const inputDetalhes = document.getElementById('input-detalhes'); 

    // Lista de todos os submenus/inputs que devem ser escondidos/mostrados
    const allSubmenus = [submenuMaterias, submenuEstilos, inputDetalhes];

    /**
     * Função que esconde todos os submenus, exceto o que for passado como argumento.
     * @param {HTMLElement} menuToExclude O submenu que deve permanecer aberto (ou null para fechar todos).
     */
    function closeOtherSubmenus(menuToExclude) {
        allSubmenus.forEach(menu => {
            if (menu && menu !== menuToExclude) {
                menu.classList.remove('submenu-ativo');
            }
        });
    }

    // LÓGICA DO CLIQUE EM MATÉRIAS
    if (btnMaterias && submenuMaterias) {
        btnMaterias.addEventListener('click', () => {
            closeOtherSubmenus(submenuMaterias); // Fecha os outros
            submenuMaterias.classList.toggle('submenu-ativo'); // Alterna o Matérias
        });
    }

    // LÓGICA DO CLIQUE EM ESTILOS
    if (btnEstilos && submenuEstilos) {
        btnEstilos.addEventListener('click', () => {
            closeOtherSubmenus(submenuEstilos); // Fecha os outros
            submenuEstilos.classList.toggle('submenu-ativo'); // Alterna o Estilos
        });
    }
    
    // LÓGICA DO CLIQUE EM DETALHES (MOSTRA A CAIXA DE TEXTO)
    if (btnDetalhes && inputDetalhes) {
        btnDetalhes.addEventListener('click', () => {
            closeOtherSubmenus(inputDetalhes); // Fecha os outros
            inputDetalhes.classList.toggle('submenu-ativo'); // Alterna o Detalhes
        });
    }
});