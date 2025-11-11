document.addEventListener('DOMContentLoaded', () => {
    // 1. OBTENDO DADOS E ELEMENTOS
    const userEmail = localStorage.getItem('userEmail');
    const userEmailElement = document.getElementById('userEmailDisplay'); 
    const userNameElement = document.querySelector('.user-name');
    const btnLogout = document.getElementById('btnLogout'); 
    const btnChangePassword = document.getElementById('btnChangePassword'); 
    
    // ----------------------
    // A) INJEÇÃO DO E-MAIL
    // ----------------------
    if (userEmail && userEmailElement) {
        userEmailElement.textContent = userEmail; // Exibe o e-mail
    }

    // ----------------------
    // B) LÓGICA DE SAIR (LOGOUT)
    // ----------------------
    if (btnLogout) {
        btnLogout.addEventListener('click', (event) => {
            event.preventDefault(); 
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            
            Swal.fire({ /* ... */ }).then(() => {
                window.location.href = 'TelaLogin.html';
            });
        });
    }

    // ----------------------
    // C) LÓGICA DE MUDAR SENHA
    // ----------------------
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', (event) => {
            event.preventDefault(); 
            window.location.href = 'TelaMudarSenha.html'; // Redireciona
        });
    }
});