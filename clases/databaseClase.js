class Database {
    constructor(database) {
        this.id = database.iddatabase;
        this.nombre = database.database;
        this.password = database.database;
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

    set password(password) {
        var regexPassword = /^\d{10}$/;
        if (regexPassword.test(Password)) {
            this._Password = Password;
        } else {
            console.error("contraseña inválido");
            this._Password = null;
        }
    }


    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get password() {
        return this._Password;
    }

    get obtenerDatos() {
        return {
            idusuario: this.id,
            nombre: this.nombre,
            password: this.password,
        }
    }
}

module.exports = Usuario;