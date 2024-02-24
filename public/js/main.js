let docTitle = document.title
window.addEventListener("blur", () => {
    document.title = "Volta aqui! 😭"
})

window.addEventListener("focus", () => {
    document.title = docTitle;
})

console.log('%cNão escreva códigos aqui se não sabe o que está a fazer', 'color: red; font-size: 20px; font-weight: bold;');

