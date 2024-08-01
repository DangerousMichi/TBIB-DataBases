const ConectarBD = require("./conexionBD");

class UsuarioDB extends ConectarBD {
    constructor() {
        super();
    }

    async nuevoUsuario(usuario) {
        const sql = "INSERT INTO usuarios VALUES(null, '"+usuario.nombre+"', '"+usuario.correo+"' , '"+usuario.nombreUsuario+"', '"+usuario.password+"');";
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Dato insertado a MySql");
        } catch (error) {
            console.error("Error al insertar datos en MySql" +error);
            console.error(sql);
        }
    }

    async mostrarUsuarios(){
        const sql = "SELECT * FROM usuarios";
        var usuariosBD;
        try{
            await this.conectarMySQL();
            [usuariosBD]=await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Usuarios Recuperados");
            // console.log(usuariosBD);
            return usuariosBD;
        } catch (error){
            console.error("Error al recuperar los datos de usuarios "+error);
            console.error(sql);
        }
    }
    async buscarUsuarioPorID(idUsuario){
        const sql="SELECT * FROM usuarios WHERE idusuario="+ idUsuario;
        try {
            await this.conectarMySQL();
            const usuario=await this.conexion.execute(sql);
            await this.cerrarConexion();
            console.log("Usuario registrado correctamente");
            return usuario;
        } catch (error){
            console.error("Error al recuperar el usuario "+ error);
            console.error(sql);
        }
    }

    async editarUsuario(usuario){
        const sql2=`
        UPDATE usuarios SET
        nombre="${usuario.nombre}",
        celular="${usuario.celular}",
        correo="${usuario.correo}"
        WHERE idusuario="${usuario.idusuario}"
        `;
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql2);
            await this.cerrarConexion();
        } catch (error) {
            console.error("Error al editar usuario"+error);
            console.error(sql12);
        }
    }

    async borrarUsuario(idusuario){
        const sql="DELETE FROM usuarios WHERE idusuario="+idusuario;
        try {
            await this.conectarMySQL();
            await this.conexion.execute(sql);
            await this.cerrarConexion();
        } catch (error) {
            console.error("Error al borrar el usuario"+error);
            console.error(sql);
        }
    }
}
module.exports = UsuarioDB;