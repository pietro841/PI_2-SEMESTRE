import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, addDoc, onSnapshot, collection, query, orderBy, serverTimestamp, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- CONFIGURAÇÃO E AUTENTICAÇÃO FIREBASE ---

setLogLevel('Debug');

const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
const firebaseConfig = typeof window.__firebase_config !== 'undefined' ? JSON.parse(window.__firebase_config) : {};
const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : undefined;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = null;
let isAuthReady = false;

// 1. Inicia Autenticação e Listener

onAuthStateChanged(auth, (user) => {
    const btnGerar = document.getElementById('btnGerarImg');

    if (user) {
        // --- 1. AUTENTICADO (Estado esperado) ---
        userId = user.uid;
        isAuthReady = true;
        document.getElementById('user-id-display').textContent = userId;

        // HABILITA O BOTÃO
        if (btnGerar) {
            btnGerar.disabled = false;
            btnGerar.textContent = "Gerar Imagem";
        }
        
        setupHistoryListener();
    } else {
        // --- 2. NÃO AUTENTICADO (Estado de erro/redirecionamento) ---
        // Este bloco só deve ser executado se o token expirar ou for inválido.
        console.error("Autenticação inválida. Redirecionando ou bloqueando a página.");
        userId = null;
        isAuthReady = false;
        
        // DESABILITA O BOTÃO
        if (btnGerar) {
            btnGerar.disabled = true;
            btnGerar.textContent = "Requer Login Válido"; 
        }
        document.getElementById('user-id-display').textContent = 'Erro de Acesso';
        
        // Aqui você poderia adicionar um redirecionamento para a tela de login, se necessário
        // Ex: window.location.href = '/login';
    }
});

// --- FUNÇÕES FIREBASE (O MÁXIMO DE SIMPLICIDADE) ---

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
            timestamp: serverTimestamp()
        });
        console.log("Histórico salvo com sucesso no caminho:", collectionPath);
    } catch (e) {
        console.error("Erro ao salvar histórico no Firestore:", e);
    }
};

/**
 * 3. CARREGA O HISTÓRICO: Configura o listener em tempo real (onSnapshot)
 * e renderiza os itens na UI.
 */
function setupHistoryListener() {
    if (!db || !userId) return;

    // Define o caminho da coleção privada do usuário
    const collectionPath = `artifacts/${appId}/users/${userId}/image_history`;
    const historyCollectionRef = collection(db, collectionPath);

    // Cria a query: ordena por timestamp (do mais novo para o mais antigo)
    const q = query(historyCollectionRef, orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        const historyContent = document.getElementById('history-content');
        historyContent.innerHTML = '';

        if (snapshot.empty) {
            historyContent.innerHTML = '<p class="text-gray-500 text-center p-4">Nenhuma imagem gerada ainda. Vá para a aba "Gerar" para começar!</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            // Formata o timestamp ou exibe status de carregamento
            const time = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString('pt-BR') : 'Data Indisponível';
            const promptPreview = data.prompt.substring(0, 80) + (data.prompt.length > 80 ? '...' : '');

            // Cria o elemento HTML para o item do histórico
            historyContent.innerHTML += `
                <div class="bg-gray-50 p-4 rounded-lg shadow-md mb-4 hover:shadow-xl transition-shadow cursor-pointer">
                    <p class="text-xs text-gray-500 mb-2">${time}</p>
                    <p class="font-semibold mb-2 text-sm">${promptPreview}</p>
                    <img src="data:image/jpeg;base64,${data.base64}" alt="Imagem gerada" 
                            class="w-full h-auto rounded-lg mt-2 border border-gray-200">
                </div>
            `;
        });
    }, (error) => {
        console.error("Erro ao carregar histórico:", error);
        document.getElementById('history-content').innerHTML = '<p class="text-red-500 text-center p-4">Erro ao carregar histórico.</p>';
    });
}
