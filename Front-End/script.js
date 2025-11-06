document.addEventListener('DOMContentLoaded', function () {


    // 1. DEFINIÇÃO DAS VARIÁVEIS


const sidebar = document.getElementById('sidebar');
const toggleButton = document.getElementById('btnToggleSidebar');
const detalhesCollapse = document.getElementById('detalhes-colapso');
const comandoTextarea = document.getElementById('comando-edicao-textarea');

// Seletores unificados para links que acionam collapse
const allCollapseToggles = document.querySelectorAll('.menu-link[data-bs-toggle="collapse"], .sub-menu-toggle[data-bs-toggle="collapse"]');

// Variáveis para a lógica de 'checked'
const subAreaLinks = document.querySelectorAll('#materias-colapso .sub-menu-link');
const estiloLabels = document.querySelectorAll('#estilos-colapso .sub-menu-link');
const estiloRadios = document.querySelectorAll('input[name="estilo_escolhido"]');

// Variável para o botão de limpar
const btnLimpar = document.getElementById('btnLimparSelecoes');

// >>> NOVAS VARIÁVEIS PARA LIXEIRA E DOWNLOAD <<<
const btnDownloadImage = document.getElementById('btnDownloadImage');
const btnDeleteImage = document.getElementById('btnDeleteImage');
const imageContainer = document.getElementById('image-container'); // O contêiner da imagem/texto

// Variáveis para os dois Toasts
const toastSuccessElement = document.getElementById('toastSuccess');
const toastWarningElement = document.getElementById('toastWarning');

let toastSuccessInstance = null;
let toastWarningInstance = null;



    // 2. FUNÇÃO DE FECHAMENTO GLOBAL

    function closeAllCollapses() {
        const openCollapses = document.querySelectorAll('.collapse.show');
        openCollapses.forEach(collapseElement => {
            if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, { toggle: false });
                bsCollapse.hide();
            }
        });
    }

    function clearAllSelections() {

        let wasAnythingCleared = false;

        // A. Limpa Matérias/Subtópicos
        subAreaLinks.forEach(link => {

            if (link.classList.contains('active-selection')) {
                link.classList.remove('active-selection');
                wasAnythingCleared = true;
            }
        });

        // B. Limpa Estilos (Labels e Rádios)
        estiloLabels.forEach(label => {

            if (label.classList.contains('active-selection')) {
                label.classList.remove('active-selection');
                wasAnythingCleared = true;
            }
        });
        estiloRadios.forEach(radio => {

            if (radio.checked) {
                radio.checked = false;
                wasAnythingCleared = true;
            }
        });

        // C. Limpa o comando de edição
        if (comandoTextarea && comandoTextarea.value.trim() !== '') {
            comandoTextarea.value = '';
            comandoTextarea.placeholder = "Girar, mudar cor, etc...";
            wasAnythingCleared = true;
        }


        // TOAST CONDICIONAL: Mostra SUCESSO ou AVISO
        if (wasAnythingCleared) {
            // Mostra o Toast de SUCESSO
            if (toastSuccessElement) {
                if (!toastSuccessInstance) {
                    toastSuccessInstance = new bootstrap.Toast(toastSuccessElement);
                }
                // Verifica se o Toast de Aviso está sendo exibido e esconde se necessário (prevenção de conflito)
                if (toastWarningInstance) {
                    toastWarningInstance.hide();
                }
                toastSuccessInstance.show();
            }
        } else {
            // Mostra o Toast de AVISO
            if (toastWarningElement) {
                if (!toastWarningInstance) {
                    toastWarningInstance = new bootstrap.Toast(toastWarningElement);
                }
                // Verifica se o Toast de Sucesso está sendo exibido e esconde se necessário
                if (toastSuccessInstance) {
                    toastSuccessInstance.hide();
                }
                toastWarningInstance.show();
            }
        }
    }
// ... (O código acima da clearAllSelections) ...

// ----------------------------------------------------
// 11. FUNÇÃO PARA EXCLUIR IMAGEM E RESETAR O CONTEÚDO (Lixeira)
// ----------------------------------------------------

function deleteImageAndReset() {
    // 1. Limpa todas as seleções na sidebar
    clearAllSelections(); 
    
    // 2. Reseta o conteúdo da caixa de imagem (image-container)
    if (imageContainer) { 
        // 2.1. Remove qualquer imagem gerada (apaga o que estiver lá)
        const currentImage = imageContainer.querySelector('img');
        if (currentImage) {
             currentImage.remove();
        }
        
        // 2.2. Restaura o HTML inicial da caixa branca
        // (Baseado no seu HTML, o texto inicial)
        imageContainer.innerHTML = `
            <p>O resultado da geração da imagem aparecerá aqui. Use o menu lateral para as escolhas da geração.</p>
        `;
        
        // *OPCIONAL*: Aqui você pode disparar um Toast de sucesso se desejar.
    }
}


// ----------------------------------------------------
// 12. FUNÇÃO PARA DOWNLOAD DA IMAGEM
// ----------------------------------------------------

function downloadImage() {
    if (imageContainer) {
        // Encontra a tag <img> que foi gerada dentro do image-container.
        const imagem = imageContainer.querySelector('img');
        
        if (imagem && imagem.src) {
            // Cria um link temporário para forçar o download
            const link = document.createElement('a');
            link.href = imagem.src;
            // Define o nome do arquivo
            link.download = `imagem_criada_${Date.now()}.png`; 
            
            // Simula o clique
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // *OPCIONAL*: Adicionar um Toast de sucesso aqui
        } else {
            console.warn("Nenhuma imagem válida para baixar.");
            // *OPCIONAL*: Adicionar um Toast de aviso aqui
        }
    }
}

// 3. FUNÇÃO REUTILIZÁVEL PARA GERENCIAR O ÍCONE DE SELEÇÃO ...
// ... (o restante do seu código JS continua)
    // 3. FUNÇÃO REUTILIZÁVEL PARA GERENCIAR O ÍCONE DE SELEÇÃO (checked)

    function handleSelection(links, clickedElement, isRadioGroup = false) {

        // Logica para remover de todos e adicionar ao clicado
        links.forEach(link => {
            link.classList.remove('active-selection');
        });

        clickedElement.classList.add('active-selection');

        if (isRadioGroup) {
            const radioId = clickedElement.getAttribute('for');
            const radioInput = document.getElementById(radioId);
            if (radioInput) {
                radioInput.checked = true;
                // Garante que o evento 'change' seja disparado para lógica externa (se houver)
                radioInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }


    // 4. LISTENER PARA LIMPAR O TEXTAREA (ao fechar o colapso)

    if (detalhesCollapse && comandoTextarea) {
        detalhesCollapse.addEventListener('hide.bs.collapse', function () {
            comandoTextarea.value = "";
            comandoTextarea.placeholder = "Girar, mudar cor, etc...";
        });
    }


    // 5. TOGGLE PRINCIPAL (SIDEBAR)

    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function () {

            const isExpanded = sidebar.classList.contains('expanded');

            if (isExpanded) {
                closeAllCollapses();
                if (comandoTextarea) {
                    comandoTextarea.blur();
                }
                sidebar.classList.remove('expanded');
                sidebar.classList.add('minimized');
            } else {
                sidebar.classList.remove('minimized');
                sidebar.classList.add('expanded');
            }
        });
    }


    // 6. ACORDEÃO MANUAL E EXPANSÃO DA SIDEBAR

    allCollapseToggles.forEach(link => {
        link.addEventListener('click', function (e) {

            // 6a. Expande a sidebar se estiver minimizada
            if (sidebar.classList.contains('minimized')) {
                sidebar.classList.remove('minimized');
                sidebar.classList.add('expanded');
            }

            // Lógica de Acordeão Manual (restante do seu código)
            const targetId = link.getAttribute('data-bs-target');
            const targetElement = document.querySelector(targetId);

            allCollapseToggles.forEach(otherLink => {
                const otherTargetId = otherLink.getAttribute('data-bs-target');
                const otherTargetElement = document.querySelector(otherTargetId);

                if (otherTargetElement && otherTargetElement !== targetElement && otherTargetElement.classList.contains('show')) {

                    const isAncestor = otherTargetElement.contains(targetElement);

                    if (!isAncestor) {

                        const isSameLevel = link.closest('.collapse') === otherLink.closest('.collapse') || link.closest('.menu-principal') === otherLink.closest('.menu-principal');

                        if (isSameLevel) {
                            if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(otherTargetElement, { toggle: false });
                                bsCollapse.hide();
                            }
                        }
                    }
                }
            });

        }); // Fim do allCollapseToggles.forEach
    }); // Fim do link.addEventListener


    // 7. ÍCONE 'CHECKED' - SUBÁREAS

    subAreaLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            handleSelection(subAreaLinks, link);
        });
    });


    // 8. ÍCONE 'CHECKED' - ESTILOS

    estiloLabels.forEach(label => {
        label.addEventListener('click', function (e) {
            handleSelection(estiloLabels, label, true);
        });
    });

    // Configuração inicial do ícone de estilo
    estiloRadios.forEach(radio => {
        if (radio.checked) {
            const labelForRadio = document.querySelector(`label[for="${radio.id}"]`);
            if (labelForRadio) {
                labelForRadio.classList.add('active-selection');
            }
        }
    });


    // 9. LISTENER PARA O BOTÃO DE LIMPAR
    if (btnLimpar) {
        btnLimpar.addEventListener('click', clearAllSelections);
    }
   // 9. LISTENER PARA O BOTÃO DE LIMPAR
if (btnLimpar) {
    btnLimpar.addEventListener('click', clearAllSelections);
}

// ----------------------------------------------------
// 13. LISTENERS PARA DOWNLOAD E EXCLUSÃO (INSIRA AQUI!)
// ----------------------------------------------------

if (btnDeleteImage) {
    // Conecta o botão de lixeira à função de reset
    btnDeleteImage.addEventListener('click', deleteImageAndReset);
}

if (btnDownloadImage) {
    // Conecta o botão de download à função de download
    btnDownloadImage.addEventListener('click', downloadImage);
}


// 10. ESTADO INICIAL
// ... (seu código // 10. ESTADO INICIAL continua aqui)

    // 10. ESTADO INICIAL

    // ... linhas anteriores ...

    // 10. ESTADO INICIAL

    if (sidebar) {
        // REMOVA AS TRÊS LINHAS ABAIXO!
        // sidebar.classList.remove('expanded');
        // sidebar.classList.add('minimized');
        // closeAllCollapses(); 
    }
}); 
// ... restante do seu código ...
    


// Garante que o código só é executado após o HTML carregar
document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTOS DA SIDEBAR DO USUÁRIO ===
    const btnUsuario = document.getElementById('btnUsuario');
    const sidebarUsuario = document.getElementById('sidebarUsuario');
    const btnCloseUser = document.getElementById('btnCloseUser');

    // Nomes de classes únicos para evitar conflitos
    const OPEN_CLASS = 'open-user';
    
    // Função para alternar a classe de abertura
    function toggleSidebarUsuario() {
        if (sidebarUsuario) {
            sidebarUsuario.classList.toggle(OPEN_CLASS);
        }
    }

    // 1. Abrir/Fechar ao clicar no botão principal
    if (btnUsuario) {
        btnUsuario.addEventListener('click', (event) => {
            // Impedimos que o evento de clique "vaze" e feche a sidebar imediatamente (ver ponto 3)
            event.stopPropagation(); 
            toggleSidebarUsuario();
        });
    }

    // 2. Fechar ao clicar no botão 'X' (mais usado em mobile)
    if (btnCloseUser) {
        btnCloseUser.addEventListener('click', toggleSidebarUsuario);
    }

    // 3. Fechar a sidebar se o usuário clicar FORA dela
    document.addEventListener('click', (event) => {
        // Verifica se a sidebar está aberta E se o clique não foi:
        // a) dentro da própria sidebar E
        // b) no botão que a abre
        
        const isClickInsideSidebar = sidebarUsuario && sidebarUsuario.contains(event.target);
        const isClickOnUserButton = btnUsuario && btnUsuario.contains(event.target);

        if (sidebarUsuario && sidebarUsuario.classList.contains(OPEN_CLASS) && !isClickInsideSidebar && !isClickOnUserButton) {
            toggleSidebarUsuario();
        }
    });

});
// ... dentro do document.addEventListener('DOMContentLoaded', ...)

const sidebarMaterias = document.getElementById('sidebar'); // ID da sua sidebar de matérias
const OPEN_CLASS = 'open-user'; // Classe da sua sidebar de usuário

function toggleSidebarUsuario() {
    if (sidebarUsuario) {
        sidebarUsuario.classList.toggle(OPEN_CLASS);
        
        // CORREÇÃO CRÍTICA: Se a sidebar do usuário abrir, feche a sidebar de matérias
        if (sidebarUsuario.classList.contains(OPEN_CLASS) && sidebarMaterias) {
            // Remova todas as classes que mantêm sua sidebar de matérias aberta
            sidebarMaterias.classList.remove('open', 'expanded', 'minimized'); 
            // Se sua sidebar de matérias usa a classe 'minimized' para estar fechada, o código acima é o contrário do que você precisa.
            
            // VERIFIQUE: Qual classe sua sidebar de matérias usa para estar FECHADA?
            // Se 'minimized' é o estado FECHADO, você deve garantir que ela tenha essa classe:
            sidebarMaterias.classList.add('minimized'); 
        }
    }
}

// ... e vice-versa no botão da sidebar de matérias:
const btnToggleSidebarMaterias = document.getElementById('btnToggleSidebar');

if (btnToggleSidebarMaterias) {
    btnToggleSidebarMaterias.addEventListener('click', () => {
         // Fecha a sidebar de usuário quando o botão de matérias for clicado
         if (sidebarUsuario && sidebarUsuario.classList.contains(OPEN_CLASS)) {
             toggleSidebarUsuario(); // Chama a função que fecha a sidebar de usuário
         }
    });
}

// ...
