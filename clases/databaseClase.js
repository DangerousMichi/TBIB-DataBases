class Database {
    constructor(database) {
        this.nombre = database.nombre;
    }

    set nombre(nombre) {
        this._nombre = nombre;
        var regexNombre = /^[a-zA-Z0-9._]{3,20}$/;

        if (regexNombre.test(nombre)) {
            this._nombre = nombre;
        } else {
            console.error("Nombre de Base de datos inválido");
            this._nombre = null;
        }
    }

    get nombre() {
        return this._nombre;
    }

    get obtenerDatos() {
        return {
            nombre: this.nombre,
        }
    }
}

module.exports = Database;