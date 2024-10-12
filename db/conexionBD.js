require('dotenv').config();
class ConectarBD {
    constructor() {
    this.conexion = null;

    this.mysql = require("mysql2/promise");
    }
    
    async conectarMySQL() {
    try {
        this.conexion=await this.mysql.createConnection({
        host: process.env.HOSTMYSQL,
        database: process.env.DATABASEMYSQL, // <- it use to be this ---> database: "c_accesos_tbib",
        user: process.env.USERMYSQL,
        password: process.env.PASSWORDMYSQL,
        port: process.env.PORTMYSQL
        });
        console.log("Conexion creada a MySql");
    } catch (error) {
        console.error("Error al crear la conexion", error);
    }
    }
    async cerrarConexion() {
    if (this.conexion != null) {
        try {
                await this.conexion.end();
                console.log("Conexion cerrada de MySql");
            } catch (error) {
                console.error("Error al cerrar la conexion", error);
            }
        }
        else{
            console.error("Error al cerrar la conexión"+error);
        }
    }
}
module.exports=ConectarBD;
