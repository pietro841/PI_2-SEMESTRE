function resetForm() {
    // 1. Limpa o texto da descrição adicional (Textarea)
    const comandoTextarea = document.getElementById('comando-edicao-textarea');
    if (comandoTextarea) {
        comandoTextarea.value = '';
    }

    // 2. Limpa as seleções visuais (Matéria/Subtópico e Estilo)
    // Remove a classe 'active-selection' de todos os links e labels
    document.querySelectorAll('.active-selection').forEach(element => {
        element.classList.remove('active-selection');
    });

    // 3. Limpa os inputs de rádio checados (Estilos)
    // Desmarca todos os inputs de rádio com o nome 'estilo_escolhido'
    document.querySelectorAll('input[name="estilo_escolhido"]').forEach(radio => {
        radio.checked = false;
    });

    console.log("Formulário resetado.");
}