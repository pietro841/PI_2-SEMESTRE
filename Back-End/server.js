
// Importa as bibliotecas 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const sharp = require('sharp');
// Conexão .env
require('dotenv').config();
// GEMINI
const { GoogleGenAI } =  require ("@google/genai");
const ai = new GoogleGenAI({});
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

//GEMINI CONFIG

app.post('/api/ia/gerar-imagem', async (req, res) => {
    // Pega o tópico (ex: "Termodinâmica") e o estilo (ex: "vetor") do corpo da requisição
    const { topico, estilo } = req.body;

    if (!topico || !estilo) {
        return res.status(400).json({ error: 'Os campos "topico" e "estilo" são obrigatórios.' });
    }

    try {
        // CONSTRUÇÃO DO PROMPT DA IMAGEM
        // Criamos um prompt detalhado com base na entrada do usuário para guiar a IA
        const promptParaImagem = `Crie uma imagem de alta qualidade sobre o tópico: "${topico}". O estilo da imagem deve ser estritamente "${estilo}". Use uma paleta de cores moderna e composição cinematográfica.`;

        // INICIALIZAÇÃO E CHAMADA À API IMAGEN
        // Nota: Esta é uma chamada de API REST direta para o modelo de imagem.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${process.env.GEMINI_API_KEY}`;
        
        const payload = { 
            instances: { 
                prompt: promptParaImagem,
                // Você pode adicionar parâmetros de estilo e tamanho aqui se quiser,
                // mas vamos manter o prompt detalhado por enquanto.
                
                // Exemplo de tamanho (padrão 1024x1024)
                
            }, 
            parameters: { 
                "sampleCount": 1
            } 
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Extrai a imagem Base64 da resposta
        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
            const base64Data = result.predictions[0].bytesBase64Encoded;
            
            // Retorna o Base64. O frontend pode usá-lo em uma tag <img>
            res.json({ 
                status: "success",
                image_base64: base64Data
            });
            
        } else {
             // Caso a geração falhe (ex: prompt foi filtrado)
            res.status(500).json({ 
                status: "error", 
                message: "A geração de imagem falhou ou foi bloqueada.",
                details: result.error || "Resposta inesperada."
            });
        }

    } catch (error) {
        console.error("Erro geral na API de Imagem:", error);
        res.status(500).json({ error: "Erro interno no servidor ao gerar imagem." });
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