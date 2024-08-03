const ConectarBD = require("./conexionBD");

class DatabaseDB extends ConectarBD {
    constructor() {
        super();
    }

    async nuevaDB(database) {

        const sql = `CREATE DATABASE \`${database.nombre}\`;`;
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Base de datos creada con exito en TBIB-Sql");
        } catch (error) {
            console.error("Error al crear Base de datos en TBIB-Sql" +error);
            console.error(sql);
        }
    }

    async mostrarDatabases(){

        const MyDb = new ConectarBD();
        await MyDb.conectarMySQL();
        const sql = `SHOW DATABASES`;
        const [rows] = await MyDb.conexion.query(sql);
        await MyDb.cerrarConexion(); 
        console.log("Databases retrieved:", rows); 
        return rows;

    }

    async borrarDB(database) {

        const sql = `DROP DATABASE \`${database.nombre}\`;`;
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Base de datos eliminada con exito de TBIB-Sql");
        } catch (error) {
            console.error("Error al eliminar la Base de datos en TBIB-Sql" +error);
            console.error(sql);
        }
    }
}
module.exports = DatabaseDB;