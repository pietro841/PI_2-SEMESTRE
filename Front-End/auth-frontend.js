// cadastro-login.js

const BACKEND_URL = 'http://localhost:3000/api';

// =========================================================
// 1. A FUNÇÃO DE LÓGICA DE CADASTRO (handleRegister)
// =========================================================
const handleRegister = async (event) => {
    event.preventDefault();

    const email = document.getElementById('cadastro-email').value;
    const password = document.getElementById('cadastro-senha').value;
    const confirmPassword = document.getElementById('confirmar-senha').value;

    const data = {
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };
    //CAMPOS NAO PREENCHIDOS
    if (!email || !password || !confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Preencha todos os campos antes de continuar.',
        });
        return;
    }
    // SENHAS DIFERENTES
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Erro de Preenchimento',
            text: 'As senhas digitadas não coincidem.',
        });
        return;
    }
    //TAMANHO DE SENHA
    if (password.length < 5) {
        Swal.fire({
            icon: 'warning',
            title: 'Senha muito curta',
            text: 'A senha deve ter pelo menos 5 caracteres.',
        });
        return;
    }
    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();



        if (response.ok) { // Status 201 (Sucesso)

            // 🚀 SweetAlert para SUCESSO e Redirecionamento
            Swal.fire({
                icon: 'success',
                title: 'Cadastro Concluído!',
                text: `${result.msg}. Você será redirecionado para o login.`,
                timer: 2500,
                showConfirmButton: false
            }).then(() => {
                // 🚨 REDIRECIONA para a Tela de LOGIN APÓS o SweetAlert fechar
                window.location.href = 'TelaLogin.html';
            });

        } else { // Status 400 ou 500 (Erro)

            // ❌ SweetAlert para ERRO no Cadastro
            Swal.fire({
                icon: 'error',
                title: 'Falha no Cadastro',
                text: result.msg, // Usa a mensagem de erro do Backend
            });
        }


    } catch (error) {
        // 🚨 SweetAlert para ERRO de Conexão
        Swal.fire({
            icon: 'warning',
            title: 'Erro de Conexão',
            text: 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3000.',
        });
        console.error("Erro de Rede:", error);
    }
}

// =========================================================
// 2. A FUNÇÃO DE LÓGICA DE LOGIN (handleLogin)
// =========================================================

const handleLogin = async (event) => {
    event.preventDefault();

    // Código para capturar email/senha (adaptado para clareza)
    const email = document.getElementById('receber-email').value;
    const password = document.getElementById('receber-senha').value;
    //CAMPOS NAO PREENCHIDOS
    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Digite seu email e senha para continuar.',
        });
        return; // Sai da função sem chamar o backend
    }

    const data = { email, password };


    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) { // Sucesso no Login (Status 200)

            // 🚀 SweetAlert para SUCESSO no Login e Redirecionamento
            Swal.fire({
                icon: 'success',
                title: 'Login Bem-Sucedido!',
                text: 'Seja Bem-Vindo(a)!',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // **AQUI VOCÊ DEVE SALVAR O TOKEN JWT:
                // window.localStorage.setItem('token', result.token); 
                if (result.token && result.user && result.user.email) {
                    window.localStorage.setItem('token', result.token);
                    window.localStorage.setItem('userEmail', result.user.email);
                }
                // 🚨 REDIRECIONA para a Página Principal
                window.location.href = 'PaginaPrincipal.html';
            });

        } else {

            // ERRO no Login
            Swal.fire({
                icon: 'error',
                title: 'Falha no Login',
                text: result.msg || 'Senha ou email inválido',
            });
        }

    } catch (error) {
        // 🚨 SweetAlert para ERRO de Conexão
        Swal.fire({
            icon: 'warning',
            title: 'Erro de Conexão',
            text: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.',
        });
        console.error("Erro de Rede:", error);
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