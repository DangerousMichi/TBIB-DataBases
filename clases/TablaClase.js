// classTabla.js
class Tabla {
    constructor(tabla) {
        this.nombre = tabla.nombre; // Usar el setter para validar el nombre
        this.columnas = tabla.columnas || []; // Inicializa columnas como un array
    }

    set nombre(nombre) {
        var regexNombre = /^[a-zA-Z0-9._]{3,}$/;

        if (regexNombre.test(nombre)) {
            this._nombre = nombre;
        } else {
            console.error("Nombre de Tabla inválido");
            this._nombre = null;
        }
    }

    get nombre() {
        return this._nombre;
    }

    set columnas(columnas) {
        this._columnas = columnas.map(columna => {
            const regexColumna = /^[a-zA-Z0-9._]{3,}$/;
            if (regexColumna.test(columna.name)) {
                return columna;
            } else {
                console.error(`Nombre de columna inválido: ${columna.name}`);
                return null; // O puedes lanzar un error
            }
        }).filter(col => col !== null); // Filtra columnas inválidas
    }

    get columnas() {
        return this._columnas;
    }

    get obtenerDatos() {
        return {
            nombre: this.nombre,
            columnas: this.columnas
        };
    }

    agregarColumna(columna) {
        this.columnas.push(columna);
    }
}

module.exports = Tabla;
