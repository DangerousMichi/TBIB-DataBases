var regexNombre = /^[a-zA-Z0-9._]{3,20}$/;
var nombre = document.getElementById("nombre");
var mensajeNombre = document.getElementsByClassName("errorNombre");
var xmarkErrorNombre = document.getElementsByClassName("xmarkErrorNombre");
var checkMarkNombre = document.getElementsByClassName("checkMarkNombre");

nombre.addEventListener("input", () => {
    if (!regexNombre.test(nombre.value)) {
        mensajeNombre[0].classList.remove("ocultar");
        xmarkErrorNombre[0].classList.remove("ocultar");
        checkMarkNombre[0].classList.add("ocultar");
        nombre.classList.add("errorInput");
        nombre.classList.remove("correctoInput"); // Elimina la clase correctoInput
    } else {
        mensajeNombre[0].classList.add("ocultar");
        xmarkErrorNombre[0].classList.add("ocultar");
        checkMarkNombre[0].classList.remove("ocultar");
        nombre.classList.add("correctoInput");
        nombre.classList.remove("errorInput"); // Elimina la clase errorInput
    }
});
