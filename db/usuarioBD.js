const ConectarBD = require("./conexionBD");

class UsuarioDB extends ConectarBD {
    constructor() {
        super();
    }

    async nuevoUsuario(usuario) {
        const sql = `CALL crearAcceso("${usuario.nombre}", "${usuario.tipoAcceso}", "${usuario.nombreUsuario}", "${usuario.password}");`;
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Acceso creado con éxito");
        } catch (error) {
            console.error("Error al insertar datos en MySQL: ", error);
            console.error("SQL ejecutado: ", sql);
            throw error; // Esto permitirá que el error se propague y sea capturado en el manejador de rutas
        }
    }
    
    async verificarAcceso(usuario, usu_name, tableName, con_name) {
        const sql = `SELECT COUNT(*) AS count
                     FROM ${tableName}
                     WHERE ${usu_name} = ? AND ${con_name} = ?;`;
        try {
            await this.conectarMySQL();
            const [rows] = await this.conexion.execute(sql, [usuario.nombreUsuario, usuario.password]);
            await this.cerrarConexion();
    
            const count = rows[0].count;
    
            if (count > 0) {
                return { existe: true, mensaje: 'El usuario existe y tiene acceso.' };
            } else {
                return { existe: false, mensaje: 'El usuario no existe o la contraseña es incorrecta.' };
            }
        } catch (error) {
            console.error("Error al verificar acceso en MySql: " + error);
            console.error(sql);
            return { existe: false, mensaje: 'Error en la verificación del acceso.' };
        }
    }
    
}
module.exports = UsuarioDB;