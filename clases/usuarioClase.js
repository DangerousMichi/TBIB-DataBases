class Usuario {
    constructor(usuario) {
        this.id = usuario.idusuario;
        this.nombre = usuario.nombre;
        this.correo = usuario.correo;
        this.nombreUsuario = usuario.nombreUsuario;
        this.password = usuario.password;

        if (!usuario) {
            throw new Error("El objeto usuario no puede ser undefined");
        }
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

    set correo(correo) {
        var regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regexCorreo.test(correo)) {
            this._correo = correo;
        } else {
            console.error("Correo inválido");
            this._correo = null;
        }
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
        var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (regexPassword.test(password)) {
            this._password = password;
        } else {
            console.error("contraseña inválido");
            this._password = null;
        }
    }


    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }
    get correo() {
        return this._correo;
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
            correo: this.correo,
            nombreUsuario: this.nombreUsuario,
            password: this.password,
        }
    }
}

module.exports = Usuario;