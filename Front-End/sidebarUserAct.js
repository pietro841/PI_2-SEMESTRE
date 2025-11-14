document.addEventListener('DOMContentLoaded', () => {
    const OPEN_CLASS = 'open-user';
    // 1. OBTENDO DADOS E ELEMENTOS
    const userEmail = localStorage.getItem('userEmail');
    const userEmailElement = document.getElementById('emailUsuario'); 
    const btnLogout = document.getElementById('btnLogout'); 
    const btnChangePassword = document.getElementById('btnChangePassword'); 
    const linkHistorico = document.getElementById('linkHistorico');
    const sidebarUsuario = document.getElementById('sidebarUsuario');
    
    //HISTORICO
    const historyModalElement = document.getElementById('historyModal');
    let historyModal = null;
    if (historyModalElement) {
        // Inicializa o objeto Bootstrap Modal (Isto requer que o JS do Bootstrap esteja carregado)
        historyModal = new bootstrap.Modal(historyModalElement); 
    }
    // ----------------------
    // A) INJEÇÃO DO E-MAIL
    // ----------------------
    if (userEmail && userEmailElement) {
        userEmailElement.textContent = userEmail; 
    }

    
    //  (LOGOUT)
    
    if (btnLogout) {
        btnLogout.addEventListener('click', (event) => {
            event.preventDefault(); 
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = 'TelaLogin.html';
        });
    }

    
    // C) LÓGICA DE MUDAR SENHA
    
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', (event) => {
            event.preventDefault(); 
            window.location.href = 'EsqueceuSenha.html'; 
        });
    }
    if (linkHistorico && sidebarUsuario && historyModal) {
        linkHistorico.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            // 1. Fecha a Sidebar do Usuário
            sidebarUsuario.classList.remove(OPEN_CLASS); // Use a classe que fecha o seu aside

            // 2. Abre a janela sobreposta do Histórico
            historyModal.show();
        });
    }
});

