const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const IMAGE_MODEL = 'imagen-4.0-generate-001';

async function generateImage(prompt) {
    if (!prompt) {
        throw new Error('O prompt é obrigatório para a geração da imagem.');
    }

    try {
        const response = await ai.models.generateImages({
            model: IMAGE_MODEL,
            prompt:prompt,
            config: {
                // ESSENCIAL: Diz ao modelo para gerar uma IMAGEM
                numberOfImages: 1,
                responseMimeType: "image/jpeg", // O nome da propriedade é diferente aqui
                aspectRatio: '1:1'
                
            }
        });

        // CÓDIGO CORRETO (Que funciona com generateContent)
        const base64Image = response.generatedImages[0].image.imageBytes;

        if (!base64Image) {
            throw new Error("A API Gemini não retornou dados de imagem...");
        }

        return base64Image;

    } catch (error) {
        console.error('Erro no serviço Gemini ao gerar imagem:', error);
        // Propaga o erro para ser tratado pela rota (controller)
        throw new Error('Falha na comunicação com a API de Imagem.');
    }
}

// Exporta a função para que ela possa ser usada em outras partes do servidor
module.exports = {
    generateImage
};
