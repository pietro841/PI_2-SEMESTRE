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
        // Envia a requisição POST para a rota de cadastro no seu backend
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Diz ao backend que estamos enviando JSON
            },
            body: JSON.stringify(data), // Converte o objeto JavaScript em string JSON
        });

        const result = await response.json(); // Pega a resposta JSON do backend (msg, etc.)

        if (response.ok) { // Status 201 (Sucesso)
            alert(`✅ Cadastro OK: ${result.msg}. Agora faça o login!`);
            // Opcional: Limpar formulário ou redirecionar
        } else { // Status 400 ou 500 (Erro)
            // Exibe a mensagem de erro vinda do seu backend (ex: "Email já cadastrado")
            alert(`❌ Erro no Cadastro: ${result.msg}`);
        }

    } catch (error) {
        // Erro de Conexão (Servidor backend offline ou URL errada)
        alert('❌ Erro de Conexão: Verifique se o backend está rodando em http://localhost:3000.');
        console.error("Erro de Rede:", error);
    }
};


// 2. A FUNÇÃO DE LÓGICA DE LOGIN (handleLogin) - Deixamos vazia por enquanto

const handleLogin = async (event) => {
    event.preventDefault();
    alert("Função de Login será implementada em breve!");
    // O código de login virá aqui.
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