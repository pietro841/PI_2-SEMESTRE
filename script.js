// Obtém referências para os elementos principais
const btnMaterias = document.getElementById('btn-materias');
const submenuMaterias = document.getElementById('submenu-materias');

const btnEstilos = document.getElementById('btn-estilos');
const submenuEstilos = document.getElementById('submenu-estilos');

const btnDetalhes = document.getElementById('btn-detalhes');
const textareaDetalhes = document.getElementById('text-detalhes');

// Função de toggle para os submenus (Materias e Estilos)
function toggleSubmenu(button, submenu) {
    // Adiciona um listener de clique ao botão
    button.addEventListener('click', () => {
        // Alterna a classe 'active' no submenu
        submenu.classList.toggle('active');

        // Opcional: Para fechar outros submenus quando um é aberto
        // if (button.id === 'btn-materias') {
        //     submenuEstilos.classList.remove('active');
        //     textareaDetalhes.classList.remove('active');
        // } else if (button.id === 'btn-estilos') {
        //     submenuMaterias.classList.remove('active');
        //     textareaDetalhes.classList.remove('active');
        // }
    });
}

// Aplica a funcionalidade aos botões de submenu
toggleSubmenu(btnMaterias, submenuMaterias);
toggleSubmenu(btnEstilos, submenuEstilos);


// Funcionalidade para o botão Detalhes
btnDetalhes.addEventListener('click', () => {
    // Alterna a classe 'active' na caixa de texto
    textareaDetalhes.classList.toggle('active');

    // Opcional: Para fechar os submenus quando a caixa de texto é exibida
    // submenuMaterias.classList.remove('active');
    // submenuEstilos.classList.remove('active');
});
