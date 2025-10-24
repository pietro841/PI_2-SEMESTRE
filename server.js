// server.js

// Importa as bibliotecas que instalamos
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// --- 1. STRING DE CONEXÃO DO MONGODB---

const MONGODB_URI = 'mongodb+srv://usuario1:42414623837@cluster0.s8tnirk.mongodb.net/?appName=Cluster0';

// --- 2. CONFIGURAÇÃO BÁSICA DO EXPRESS ---
const app = express();
// Define a porta onde o servidor vai rodar
const PORT = 3000;
app.use(cors());
// O Express precisa deste middleware para entender dados JSON enviados pelo Front-end
app.use(express.json());

app.use('/api', authRoutes);
// Rota de teste simples (se você acessar http://localhost:3000)
app.get('/', (req, res) => {
    res.send('Servidor rodando! Base pronta para Login e Cadastro.');
});


// --- 3. CONEXÃO COM O MONGODB E INICIALIZAÇÃO DO SERVIDOR ---

// Tenta conectar ao MongoDB usando a URI
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado ao MongoDB com sucesso!');

        // Se a conexão com o DB funcionar, inicia o servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log('Agora vamos criar o modelo e as rotas de usuário...');
        });
    })
    .catch((error) => {
        console.error('❌ Erro na conexão com o MongoDB. Verifique sua URI e acesso à rede!', error.message);
    });