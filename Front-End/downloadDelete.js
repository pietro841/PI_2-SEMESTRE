const imageContainer = document.getElementById('image-container');
const btnDownload = document.getElementById('btnDownloadImage');
const btnDelete = document.getElementById('btnDeleteImage');

// Habilita ou desabilita os botões de controle
function setButtonState(isEnabled) {
    if (btnDownload && btnDelete) {
        btnDownload.disabled = !isEnabled;
        btnDelete.disabled = !isEnabled;
    }
}

// Handler para o evento 'load' da imagem (dispara quando a imagem Base64 está pronta)
function handleImageLoad(event) {
    if (event.target.naturalWidth > 0) {
        setButtonState(true); // DESBLOQUEIA os botões
    }
}

// Handler para o evento 'error' da imagem
function handleImageError() {
    setButtonState(false); // BLOQUEIA os botões
    console.error("Erro ao carregar a imagem.");
}


if (btnDownload) {
    btnDownload.addEventListener('click', function () {
        // Encontra a tag <img> que está sendo exibida (usando a classe que inserimos)
        const imgElement = document.querySelector('.generated-image');

        // Validação de segurança
        if (!imgElement || !imgElement.src || btnDownload.disabled) {
            alert("Aguarde o carregamento completo da imagem antes de baixar.");
            return;
        }

        const imageUrl = imgElement.src; // Contém o Data URI (Base64)

        // 1. Cria um link temporário
        const link = document.createElement('a');
        link.href = imageUrl;

        // 2. Define o nome do arquivo a ser salvo
        // Usamos o dataset.id da imagem, se existir, ou um nome padrão.
        const imageId = imgElement.dataset.id || 'gerada';
        link.download = `imagem-${imageId}.jpeg`; // Você pode alterar a extensão para .png se for o caso

        // 3. Simula o clique para iniciar o download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Remove o elemento temporário
    });
}
if (btnDelete) {
    btnDelete.addEventListener('click',  async function () {
        const imgElement = document.querySelector('.generated-image');

        if (!imgElement || btnDelete.disabled) {
            return;
        }

        const result = await Swal.fire({
            title: 'Aviso',
            text: 'Deseja excluir a imagem?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            
        });

        // 3. Este NOVO IF faz a verificação de confirmação do SweetAlert2
        if (result.isConfirmed) {

            // Limpa o container e volta o placeholder (adaptado ao seu HTML)
            imageContainer.innerHTML = `
            <p>
                O resultado da geração da imagem aparecerá aqui. Use o menu lateral para as escolhas da geração.
            </p>
        `;

            // Bloqueia os botões de controle
            setButtonState(false);

            // Feedback visual (assumindo que você usa Swal.fire ou alert)
            // Swal.fire('Tela Limpa!', 'Imagem removida da visualização.', 'info');
            console.log("Visualização limpa.");
        }
    });
}



// ----------------------------------------------------
// D. Função de Interface Pública
// ----------------------------------------------------

// ESSA FUNÇÃO SERÁ CHAMADA DO SEU SCRIPT PRINCIPAL (onde você chama a API)
// Ela recebe os dados do back-end (URL/Base64 e ID) e exibe a imagem.
function displayGeneratedImage(imageBase64, id) {

    // 1. Limpa o container do placeholder/spinner
    imageContainer.innerHTML = '';

    // 2. Cria a tag <img>
    const imgElement = document.createElement('img');
    const imageSrc = `data:image/jpeg;base64,${imageBase64}`;

    // 3. Configura atributos
    imgElement.src = imageSrc;
    imgElement.alt = "Imagem gerada com sucesso";
    imgElement.classList.add('img-fluid', 'generated-image');

    // 4. Armazena o ID (para download/lixeira)
    imgElement.dataset.id = id;

    // 5. Adiciona os vigilantes (load/error)
    imgElement.addEventListener('load', handleImageLoad);
    imgElement.addEventListener('error', handleImageError);

    // 6. Insere no DOM
    imageContainer.appendChild(imgElement);

    // 7. Garante o bloqueio inicial até o 'load' disparar
    setButtonState(false);
}