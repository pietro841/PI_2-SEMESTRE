// auth-frontend.js
const BACKEND_URL = 'http://localhost:3000/api';

// =========================================================
// 1. A FUNÇÃO DE LÓGICA DE CADASTRO (handleRegister)
// =========================================================
const handleRegister = async (event) => {
    // Isso é essencial para impedir que a página recarregue ao clicar no botão
    event.preventDefault();

    // IMPORTANTE: Captura os valores dos campos usando os IDs do seu HTML
    const email = document.getElementById('cadastro-email').value;
    const password = document.getElementById('cadastro-senha').value;
    const confirmPassword = document.getElementById('confirmar-senha').value;

    // Cria o objeto de dados que será enviado ao backend
    const data = {
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

    try {
        // Envia a requisição POST para a rota de cadastro no  backend
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(data), 
        });

        const result = await response.json(); 

        if (response.ok) { // Status 201 (Sucesso)
            alert(`✅ Cadastro OK: ${result.msg}. Agora faça o login!`);
            // Opcional: Limpar formulário ou redirecionar
        } else { // Status 400 ou 500 (Erro)
            
            alert(`❌ Erro no Cadastro: ${result.msg}`);
        }

    } catch (error) {
        // Erro de Conexão (Servidor backend offline ou URL errada)
        alert('❌ Erro de Conexão: Verifique se o backend está rodando em http://localhost:3000.');
        console.error("Erro de Rede:", error);
    }
    // ... dentro da função handleRegister
    if (response.ok) { // Status 201 (Sucesso no Cadastro)
        alert(`✅ Cadastro OK: ${result.msg}. Agora faça o login!`);

        // 🚨 REDIRECIONA para a Tela de LOGIN
        window.location.href = 'TelaLogin.html';

    } else { // Status 400 ou 500 (Erro)
        // ...

    };
}

// 2. A FUNÇÃO DE LÓGICA DE LOGIN (handleLogin) - Deixamos vazia por enquanto

// ... implementação COMPLETA da função handleLogin

const handleLogin = async (event) => {
    event.preventDefault();

    // ... código para capturar email/senha, criar o objeto 'data' ...

    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) { // Sucesso no Login (Status 200, 202, etc.)
            alert(`Login bem-sucedido! Bem-vindo(a)!`);

            // 🚨 REDIRECIONA para a Página Principal
            window.location.href = 'PaginaPrincipal.html';

        } else { // Erro no Login
            alert(`❌ Email ou senha inválidos: ${result.msg}`);
        }

    } catch (error) {
        // ...
    }
};

// 3. O CÓDIGO DE CONEXÃO DO BOTÃO

// Conecta o botão de Cadastro
const registerButton = document.getElementById('btn-cadastro');
if (registerButton) {
    registerButton.addEventListener('click', handleRegister);
}

// Conecta o botão de Login 
const loginButton = document.getElementById('btn-login');
if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
}