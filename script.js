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


    // 10. ESTADO INICIAL

    if (sidebar) {
        sidebar.classList.remove('expanded');
        sidebar.classList.add('minimized');
        closeAllCollapses();
    }
});