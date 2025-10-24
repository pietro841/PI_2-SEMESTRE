// models/User.js

const mongoose = require('mongoose');

// Define a estrutura (schema) de como o usuário será salvo no MongoDB
const UserSchema = new mongoose.Schema({
    // Campo principal para identificação e login
    email: {
        type: String,
        required: true,      // O email é obrigatório
        unique: true,        // O email deve ser único no banco de dados
        trim: true,          // Remove espaços em branco
        lowercase: true      // Salva o email em minúsculas
    },
    // Campo para a senha (onde o hash criptografado será salvo)
    password: {
        type: String,
        required: true       // A senha é obrigatória
    },

    // Campo para registrar quando o usuário foi criado
    createdAt: {
        type: Date,
        default: Date.now    // Define a data atual automaticamente
    }
});

// Exporta o modelo para que possa ser usado nas rotas (Cadastro e Login)
module.exports = mongoose.model('User', UserSchema);