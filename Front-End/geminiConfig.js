
document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos principais para a geração
    const btnGerarImg = document.getElementById('btnGerarImg'); // Supondo que você tem esse ID no botão de gerar
    const imageContainer = document.getElementById('image-container'); // Onde a imagem será exibida
    const comandoEdicaoTextarea = document.getElementById('comando-edicao-textarea'); // Textarea de detalhes

    // --- Funções Auxiliares para Coletar Dados do Menu ---

    // 1. Obtém a subárea (Matéria/Tópico) selecionada
    function getSelectedSubarea() {
        // Busca o link ativo em todas as subáreas
        const activeLink = document.querySelector('.sub-menu-link.active-selection');
        // Retorna o valor do data-subarea-load (ex: "Mecanica", "quimica-organica")
        return activeLink ? activeLink.dataset.subareaLoad : '';
    }

    // 2. Obtém o Estilo de Imagem selecionado
    function getSelectedEstilo() {
        // Busca o input radio checado dentro do grupo de estilos
        const selectedRadio = document.querySelector('input[name="estilo_escolhido"]:checked');
        // Retorna o valor do radio (ex: "Vetor", "Desenho", "Realista")
        return selectedRadio ? selectedRadio.value : '';
    }


    // --- 🚀 Evento Principal: Gerar Imagem (Conexão com o Backend) ---

    if (btnGerarImg) {
        btnGerarImg.addEventListener('click', async () => {
            // 1. Coleta os dados que serão enviados ao servidor
            const subarea = getSelectedSubarea();
            const estilo = getSelectedEstilo();
            const descricaoAdicional = comandoEdicaoTextarea.value.trim();

            // 2. Validação básica
            if (!subarea || !estilo || !descricaoAdicional) {
                // Mostra a mensagem de aviso na tela
                Swal.fire({
                    title: 'Atenção!',
                    text: 'Você deve preencher os 3 tópicos (Subtópico, Estilo e Descrição) para gerar a imagem.',
                    icon: 'warning', 
                    confirmButtonText: 'OK'
                });

                return;
            }

            // 3. Feedback visual para o usuário (Carregando)
            imageContainer.innerHTML = `
                <div class="d-flex flex-column align-items-center justify-content-center h-100 p-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p class="mt-3 text-muted">Gerando imagem, por favor aguarde...</p>
                </div>
            `;
            imageContainer.classList.add('loading');

            // 4. Envia os dados brutos para o seu Backend
            try {
                const response = await fetch('http://localhost:3000/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subarea,
                        estilo,
                        descricaoAdicional
                    })
                });

                const data = await response.json();
                imageContainer.classList.remove('loading');

                if (data.image) {
                    // 5. Exibe a imagem gerada (em Base64)
                    imageContainer.innerHTML = `<img src="data:image/jpeg;base64,${data.image}" alt="Imagem Gerada por IA" class="img-fluid generated-image" />`;
                } else {
                    // Lida com erros do servidor
                    imageContainer.innerHTML = `
                        <p class="text-danger">Erro na geração: ${data.error || 'Ocorreu um erro desconhecido.'}</p>
                    `;
                    console.error("Erro retornado do servidor:", data.error);
                }

            } catch (error) {
                // Lida com erros de rede
                console.error('Erro de rede ou na requisição:', error);
                imageContainer.classList.remove('loading');
                imageContainer.innerHTML = `
                    <p class="text-danger">Erro de Conexão: O servidor Node.js parece estar inacessível.</p>
                `;
            }
        });
    } else {
        console.error("O botão de gerar imagem (ID: btnGerarImg) não foi encontrado.");
    }
});