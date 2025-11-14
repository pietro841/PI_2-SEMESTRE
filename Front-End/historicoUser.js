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
/**
 * 3. CARREGA O HISTÓRICO: Configura o listener em tempo real (onSnapshot)
 * e renderiza os itens na UI usando CLASSES BOOTSTRAP.
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
            const time = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString('pt-BR') : 'Data Indisponível';
            const promptPreview = data.prompt.substring(0, 80) + (data.prompt.length > 80 ? '...' : '');

            // Cria o elemento HTML para o item do histórico (COM CLASSES BOOTSTRAP)
            historyContent.innerHTML += `
                <div class="bg-light p-3 rounded shadow-sm mb-3">
                    <p class="text-muted mb-1 small">${time}</p>
                    <p class="fw-semibold mb-2">${promptPreview}</p>
                    <img src="data:image/jpeg;base64,${data.base64}" alt="Imagem gerada" 
                        class="img-fluid rounded mt-2 border border-secondary">
                </div>
            `;
        });
    }, (error) => {
        console.error("Erro ao carregar histórico:", error);
        // MENSAGEM DE ERRO (USANDO CLASSE BOOTSTRAP)
        document.getElementById('history-content').innerHTML = '<p class="text-danger text-center p-4">Erro ao carregar histórico.</p>';
    });
}
