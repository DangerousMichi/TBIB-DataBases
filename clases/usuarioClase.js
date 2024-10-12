class Usuario {
    constructor(usuario) {

         if (!usuario) {
            throw new Error("El objeto usuario no puede ser undefined");
         }
        this.id = usuario.idusuario;
        this.nombre = usuario.nombre;
        this.tipoAcceso = usuario.tipoAcceso;
        this.nombreUsuario = usuario.nombreUsuario;
        this.password = usuario.password;

    }

    set id(id) {
        this._id = id;
    }

    set nombre(nombre) {
        var regexNombre = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ][a-záéíóúñ']{1,}){0,}$/;
        if (regexNombre.test(nombre)) {
            this._nombre = nombre;
        } else {
            console.error("Nombre inválido");
            this._nombre = null;
        }
    }

    set tipoAcceso(tipoAcceso) {

            this._tipoAcceso=tipoAcceso;
        }

    set nombreUsuario(nombreUsuario) {
        this._nombreUsuario = nombreUsuario;
        var regexNombreUsuario = /^[a-zA-Z0-9._]{3,20}$/;
        if (regexNombreUsuario.test(nombreUsuario)) {
            this._nombreUsuario = nombreUsuario;
        } else {
            console.error("Nombre de usuario inválido");
            this._nombreUsuario = null;
        }
    }

    set password(password) {
        
            this._password = password;
    }


    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }
    get tipoAcceso() {
        return this._tipoAcceso;
    }
    get nombreUsuario() {
        return this._nombreUsuario;
    }
     get password() {
        return this._password;
    }

    get obtenerDatos() {
        return {
            idusuario: this.id,
            nombre: this.nombre,
            tipoAcceso: this.tipoAcceso,
            nombreUsuario: this.nombreUsuario,
            password: this.password
        }
    }
}

module.exports = Usuario;