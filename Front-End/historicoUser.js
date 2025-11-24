import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, addDoc, onSnapshot, collection, query, orderBy, serverTimestamp, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- CONFIGURAÇÃO E AUTENTICAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyBZmJ7VYD-XX5KSD0GE7XP4MykNt9yUIzw",
    authDomain: "educaia-4824c.firebaseapp.com",
    projectId: "educaia-4824c",
    storageBucket: "educaia-4824c.firebasestorage.app",
    messagingSenderId: "654013758102",
    appId: "1:654013758102:web:9426387971ff68fbf8a0b7",
    measurementId: "G-YGTRFE7TG8"
};
setLogLevel('Debug');

const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
//Variveis globais
let userId = null;
let isAuthReady = false;
//  Função para salvar histórico no Firestore
export async function salvarHistorico(prompt, base64) {
    await addDoc(
        collection(db, `artifacts/${appId}/users/${userId}/image_history`),
        {
            prompt: prompt,
            base64: base64,
            createdAt: serverTimestamp()
        }
    );
}

console.log("Firebase inicializado com sucesso!");
signInAnonymously(auth)
    .then(() => console.log("Login anônimo realizado"))
    .catch((error) => console.error("Erro no login anônimo:", error));

// 1. Inicia Autenticação e Listener

onAuthStateChanged(auth, (user) => {
    const btnGerar = document.getElementById('btnGerarImg');

    if (user) {
        // --- 1. AUTENTICADO (Estado esperado) ---
        userId = user.uid;
        isAuthReady = true;


        // HABILITA O BOTÃO
        if (btnGerar) {
            btnGerar.disabled = false;
            btnGerar.textContent = "Gerar Imagem";
        }

        setupHistoryListener();
    } else {
        // --- 2. NÃO AUTENTICADO (Estado de erro/redirecionamento) ---
        // Este bloco só deve ser executado se o token expirar ou for inválido.
        console.error("Autenticação inválida.");
        userId = null;
        isAuthReady = false;

        // DESABILITA O BOTÃO
        if (btnGerar) {
            btnGerar.disabled = true;
            btnGerar.textContent = "Requer Login Válido";
        }
        document.getElementById('user-id-display').textContent = 'Erro de Acesso';


    }
});

// --- FUNÇÕES FIREBASE  ---

/**
 * 2. SALVA O HISTÓRICO: Grava o prompt e a imagem codificada no Firestore.
 */
window.saveHistory = async (prompt, base64Image) => {
    if (!isAuthReady || !userId) {
        console.error("Erro: Autenticação não pronta para salvar histórico.");
        return;
    }

    try {
        // Define o caminho da coleção privada do usuário
        const collectionPath = `artifacts/${appId}/users/${userId}/image_history`;
        const historyCollectionRef = collection(db, collectionPath);

        await addDoc(historyCollectionRef, {
            prompt: prompt,
            base64: base64Image,
        });
        console.log("Histórico salvo com sucesso no caminho:", collectionPath);
    } catch (e) {
        console.error("Erro ao salvar histórico no Firestore:", e);
    }
};


function setupHistoryListener() {
    if (!db || !userId) return;

    // Define o caminho da coleção privada do usuário
    const collectionPath = `artifacts/${appId}/users/${userId}/image_history`;
    const historyCollectionRef = collection(db, collectionPath);
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = `
        <div class="text-center p-5 text-muted">
            <div class="spinner-border text-primary mb-2" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mb-0">Carregando histórico...</p>
        </div>
    `;
    // Cria a query: ordena por timestamp (do mais novo para o mais antigo)
    const q = query(historyCollectionRef, orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        const historyContent = document.getElementById('history-content');
        historyContent.innerHTML = ''; // Limpa o conteúdo

        if (snapshot.empty) {
            // MENSAGEM VAZIA (USANDO CLASSES BOOTSTRAP)
            historyContent.innerHTML = `
                <div class="text-center p-5 text-muted">
                    <i class="bi bi-info-circle fs-4 mb-2 d-block"></i>
                    <p class="mb-0">Histórico vazio. Comece agora a gerar imagens</p>
                </div>
            `;
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            // Formata o timestamp ou exibe status de carregamento
            
            const promptPreview = data.prompt.substring(0, 80) + (data.prompt.length > 80 ? '...' : '');

            // Cria o elemento HTML para o item do histórico (COM CLASSES BOOTSTRAP)
            historyContent.innerHTML += `
                <div class="bg-light p-3 rounded shadow-sm mb-3">
                    <p class="fw-semibold mb-2">${promptPreview}</p>
                    <img src="data:image/jpeg;base64,${data.base64}" alt="Imagem gerada" 
                        class="img-fluid rounded mt-2 border border-secondary">
                    <div class="mt-2 text-end">
                        <a href="data:image/jpeg;base64,${data.base64}" 
                            download="imagem_${doc.id}.jpg" 
                            class="btn btn-sm btn-primary">
                            Baixar
                        </a>
                    </div>
                </div>
            `;
        });
    }, (error) => {
        console.error("Erro ao carregar histórico:", error);
        // MENSAGEM DE ERRO (USANDO CLASSE BOOTSTRAP)
        document.getElementById('history-content').innerHTML = '<p class="text-danger text-center p-4">Erro ao carregar histórico.</p>';
    });
}
