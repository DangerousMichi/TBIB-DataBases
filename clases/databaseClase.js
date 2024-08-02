class Database {
    constructor(database) {
        this.id = database.idDatabase;
        this.nombre = database.nombre;
        this.host = database.host;
        this.port = database.port;
    }

    set id(id) {
        this._id = id;
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

    set host(host){
        this._host = host;
        var regexHost = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        if (regexHost.test(host)) {

            this._host = host;

        } else{
            console.error("Error: Dirección IP no válida. Debe estar en el formato 'X.X.X.X', donde X es un número entre 0 y 255.");
            this._host = null;
        }
    }

    set port(port) {
        this._port = port;
        var regexPort = /^[0-9]{3,4}$/;
        if (regexPort.test(port)) {
            this._port = port;
        } else {
            console.error("port de Base de datos inválido");
            this._port = null;
        }
    }

    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get host() {
        return this._host;
    }

    get port() {
        return this._port;
    }

    get obtenerDatos() {
        return {
            idDatabase: this.id,
            nombre: this.nombre,
            host: this.host,
            port: this.port
        }
    }
}

module.exports = Database;