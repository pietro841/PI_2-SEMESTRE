const CHAVES_FISICA = {
    "Mecanica": "vetores e ângulos, sistemas de forças, sistemas de blocos e polias, plano inclinado e pêndulos simples e cônicos",
    "Optica": "espelhos planos, espelhos esféricos e lentes",
    "Eletricidade": "circuito elétrico, fluxo de elétrons, diferença de potencial, bateria e resistores",
    "Termodinamica": "diagrama de gases, êmbolo, calor, pressão e variação de temperatura"
};
// Importa as bibliotecas 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const sharp = require('sharp');
// Conexão .env
require('dotenv').config();
// FIREBASE
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
const firebaseConfigJSON = JSON.stringify(firebaseConfig);
//GEMINI
const { generateImage} = require('./configIA');


// --- 1. STRING DE CONEXÃO DO MONGODB---
const MONGODB_URI = process.env.MONGO_URI;

// --- 2. CONFIGURAÇÃO BÁSICA DO EXPRESS ---
const app = express();
// Define a porta onde o servidor vai rodar
const PORT = process.env.PORT || 3000;
app.use(cors());
// O Express precisa deste middleware para entender dados JSON enviados pelo Front-end
app.use(express.json());

app.use('/api', authRoutes);
// Rota de teste simples 
app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

//GEMINI CONFIGURAÇÔES
app.post('/generate-image', async (req, res) => {
    try {
        // CORREÇÃO: Receber todas as variáveis do Frontend
        const { subarea, estilo, descricaoAdicional } = req.body; 
        
        // 1. MONTAGEM DO PROMPT
        let promptDeGeracao = "";

        if (subarea) {
            promptDeGeracao += `Crie uma imagem técnica e didática para o conceito de ${subarea}. `;
            
            // Adiciona as palavras-chave de Física
            const chaveEspecifica = CHAVES_FISICA[subarea]; 
            if (chaveEspecifica) {
                promptDeGeracao += `A ilustração deve incluir os seguintes elementos chave: ${chaveEspecifica}. `;
            }
        }
        
        if (estilo) {
            promptDeGeracao += `O estilo da imagem deve ser: ${estilo}. `;
        }
        
        if (descricaoAdicional) {
            promptDeGeracao += `Instruções de detalhe do usuário: ${descricaoAdicional}.`;
        }
        
        // CORREÇÃO: Checagem de prompt vazio
        if (promptDeGeracao.length === 0) {
            return res.status(400).json({ error: 'Nenhuma instrução fornecida para gerar a imagem.' });
        }

        console.log(`Gerando imagem com prompt: "${promptDeGeracao.substring(0, 50)}..."`);

        // CHAMA A FUNÇÃO DE GERAÇÃO DE IMAGEM
        const base64Image = await generateImage(promptDeGeracao.trim());

        res.json({ image: base64Image });

    } catch (error) {
        console.error('Erro na rota /generate-image:', error.message);
        res.status(500).json({ error: error.message || 'Falha interna ao gerar a imagem.' });
    }
});

// CONEXÃO COM O MONGODB E INICIALIZAÇÃO DO SERVIDOR ---

// Tenta conectar ao MongoDB usando a URI
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB com sucesso!');

        // Se a conexão com o DB funcionar, inicia o servidor Express
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
            
        });
    })
    .catch((error) => {
        console.error(error.message);
    });