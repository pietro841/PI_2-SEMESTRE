// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Para criar o token de login
const User = require('../models/user'); // Importa o modelo do usuário

// --- 1. CONFIGURAÇÃO DOS DOMÍNIOS PERMITIDOS ---
const ALLOWED_DOMAINS = ['@p4ed.com', '@sistemapoliedro.com.br'];

// Função de validação de domínio
const isDomainAllowed = (email) => {
    // Verifica se o email termina com um dos domínios permitidos
    for (const domain of ALLOWED_DOMAINS) {
        if (email.endsWith(domain)) {
            return true;
        }
    }
    return false;
};
// ----------------------------------------------


// --- CHAVE SECRETA (Guardar isso no .env em projetos reais) ---
const JWT_SECRET = 'pi_educaIA_chavesecreta';

// =========================================================
// Rota de Cadastro (Registro) (POST /api/register)
// =========================================================
router.post('/register', async (req, res) => {
    // Pega os dados enviados: email, senha e confirmação
    const { email, password, confirmPassword } = req.body;

    // 1. VALIDAÇÃO DE "CONFIRMAR SENHA"
    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'As senhas não coincidem. Verifique se foi digitado coretamente.' });
    }

    // 2. VALIDAÇÃO DE E-MAIL ESPECÍFICO
    if (!isDomainAllowed(email.toLowerCase())) {
        return res.status(400).json({ msg: 'O e-mail não pertence a um domínio autorizado.' });
    }

    try {
        // 3. Verifica se o usuário já existe no DB
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'Email já cadastrado.' });
        }

        // 4. Cria o novo documento de usuário
        user = new User({ email, password });

        // 5. Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 6. Salva o novo usuário no MongoDB
        await user.save();

        // 7. Retorna uma resposta de sucesso
        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor ao tentar cadastrar o usuário.');
    }
});

// Rota de Login (POST /api/login)

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verifica se o usuário existe no DB
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas. Verifique o email ou senha.' });
        }

        // 2. Compara a senha digitada com o hash salvo no DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas. Verifique o email ou senha.' });
        }

        // 3. Se a senha está correta, cria o Token JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        // 4. Assina (cria) o token e define a expiração
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;

                // 5. Retorna o token e os dados do usuário
                res.json({ token, user: { id: user.id, email: user.email } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor durante o login.');
    }
});
module.exports = router; // Exporta todas as rotas