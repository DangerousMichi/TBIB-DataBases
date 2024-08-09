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
        
        const sql = `SHOW DATABASES`;
        
        await this.conectarMySQL();
        const [rows] = await this.conexion.execute(sql);
        await this.cerrarConexion(); 
        console.log("Databases desplegadas:", rows); 
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

    async mostrarTablas(database) {
        const sql = `SHOW TABLES;`;
        const dbConnection = await this.mysql.createConnection({
            host: "localhost",
            database: database.nombre,
            user: "root",
            password: "",
            port: "3306",
        });

        try {
            const [rows] = await dbConnection.execute(sql);
            const tables = rows.map(row =>{
                return {nombre: Object.values(row)[0]};
            });
            console.log("Tablas en la base de datos " + database.nombre + ": ", rows);
            return tables;
        } catch (error) {
            console.error("Error al mostrar las tablas de la Base de datos en TBIB-Sql: " + error);
            console.error(sql);
        } finally {
            await dbConnection.end(); // Cerrar la conexión a la base de datos
            console.log("Conexión cerrada de la base de datos " + database.nombre);
        }
    }


    async crearTabla(database, tableName, columns) {
        if (!database || !database.nombre ) {
            console.error("El objeto de base de datos es inválido.");
            return { success: false, message: "El nombre de la base de datos no puede estar vacío." };
        }
        if (!tableName) {
            return { success: false, message: "El nombre de la tabla no puede estar vacío." };
        }
    
        let dbConnection;
        try {
            console.log("Base de datos seleccionada:", database.nombre);
            dbConnection = await this.mysql.createConnection({
                host: "localhost",
                database: database.nombre,
                user: "root",
                password: "",
                port: "3306",
            });
    
            // Construir la consulta SQL
            let columnDefinitions = columns.map(col => {
                let definition = `${col.name} ${col.datatype}`;
                if (col.pk) definition += ' PRIMARY KEY';
                if (col.nn) definition += ' NOT NULL';
                return definition;
            }).join(', ');
    
            const sql = `CREATE TABLE ${tableName} (${columnDefinitions});`;
    
            await dbConnection.execute(sql);
            console.log(`Tabla "${tableName}" creada en la base de datos "${database.nombre}".`);
            return { success: true, message: `Tabla "${tableName}" creada exitosamente.` };
        } catch (error) {
            console.error("Error al crear la tabla: ", error);
            return { success: false, message: `Error al crear la tabla: ${error.message}` };
        } finally {
            if (dbConnection) {
                await dbConnection.end(); // Cerrar la conexión a la base de datos
                console.log("Conexión cerrada de la base de datos " + database.nombre);
            }
        }
    }
    
    
    async borrarTabla(database, tableName) {
        if (!database || !database.nombre ) {
            console.error("El objeto de base de datos es inválido.");
            return { success: false, message: "El nombre de la base de datos no puede estar vacío." };
        }
        if (!tableName) {
            return { success: false, message: "El nombre de la tabla no puede estar vacío." };
        }
    
        let dbConnection;
        try {
            console.log("Base de datos seleccionada:", database.nombre);
            dbConnection = await this.mysql.createConnection({
                host: "localhost",
                database: database.nombre,
                user: "root",
                password: "",
                port: "3306",
            });
    
        
            const sql = `DROP TABLE ${tableName}`;
    
            await dbConnection.execute(sql);
            console.log(`Tabla "${tableName}" eliminada en la base de datos "${database.nombre}".`);
            return { success: true, message: `Tabla "${tableName}" eliminada exitosamente.` };
        } catch (error) {
            console.error("Error al eliminar la tabla: ", error);
            return { success: false, message: `Error al eliminar la tabla: ${error.message}` };
            throw error;
        } finally {
            if (dbConnection) {
                await dbConnection.end(); // Cerrar la conexión a la base de datos
                console.log("Conexión cerrada de la base de datos " + database.nombre);
            }
        }
    }

    async abrirTabla(database, tableName) {
        if (!database || !database.nombre ) {
            console.error("El objeto de base de datos es inválido.");
            return { success: false, message: "El nombre de la base de datos no puede estar vacío." };
        }
        if (!tableName) {
            return { success: false, message: "El nombre de la tabla no puede estar vacío." };
        }
    
        let dbConnection;
        try {
            console.log("Base de datos seleccionada:", database.nombre);
            dbConnection = await this.mysql.createConnection({
                host: "localhost",
                database: database.nombre,
                user: "root",
                password: "",
                port: "3306",
            });
        
            const sql = `SELECT * FROM ${tableName}`;
            const [rows, fields] = await dbConnection.execute(sql);
               
            console.log(`Tabla: "${tableName}" seleccionada en la base de datos "${database.nombre}".`);
            return { success: true, message: `Datos de tabla "${tableName}" seleccionados exitosamente.`, columnas: fields, datos: rows };
    
        } catch (error) {
            console.error("Error al seleccionar la tabla: ", error);
            return { success: false, message: `Error al mostrar los datos de la tabla: ${error.message}` };
        } finally {
            if (dbConnection) {
                await dbConnection.end();
                console.log("Conexión cerrada de la base de datos " + database.nombre);
            }
        }
    }
    
    async insertarDatos(database, tableName, data) {
        if (!database || !database.nombre) {
            console.error("El objeto de base de datos es inválido.");
            return { success: false, message: "El nombre de la base de datos no puede estar vacío." };
        }
        if (!tableName) {
            return { success: false, message: "El nombre de la tabla no puede estar vacío." };
        }

        let dbConnection;
        try {
            dbConnection = await this.mysql.createConnection({
                host: "localhost",
                database: database.nombre,
                user: "root",
                password: "",
                port: "3306",
            });

            const columnas = Object.keys(data).filter(key => key !== 'DBNombre' && key !== 'nombre');
            const valores = columnas.map(col => `'${data[col]}'`).join(", ");
            const columnasStr = columnas.map(col => `\`${col}\``).join(", ");
            const sql = `INSERT INTO ${tableName} (${columnasStr}) VALUES (${valores})`;

            await dbConnection.execute(sql);
            return { success: true, message: "Datos insertados exitosamente." };
        } catch (error) {
            console.error("Error al insertar los datos en la tabla: ", error);
            return { success: false, message: `Error al insertar los datos en la tabla: ${error.message}` };
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }
    }
       

    async borrarRegistro(database, tableName, IdColumName , id) {
        if (!database || !database.nombre || !tableName || !IdColumName || !id) {
            console.error("Parámetros inválidos para eliminar un registro.");
            return { success: false, message: "Faltan parámetros para eliminar el registro." };
        }
        console.log("Esta es el objeto de la base de datos recolectada",database);
        let dbConnection;
        try {
            dbConnection = await this.mysql.createConnection({
                host: "localhost",
                database: database.nombre,
                user: "root",
                password: "",
                port: "3306",
            });
    
            const sql = `DELETE FROM ${tableName} WHERE ${IdColumName} = ?`;
            await dbConnection.execute(sql, [id]);
    
            console.log(`Registro con id ${id} eliminado de la tabla ${tableName} en la base de datos ${database.nombre}.`);
            return { success: true, message: `Registro con id ${id} eliminado exitosamente.` };
            
        } catch (error) {
            console.error("Error al eliminar el registro: ", error);
            return { success: false, message: `Error al eliminar el registro: ${error.message}` };
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }
    }

    
    async actualizarRegistro(database, tableName, IdColumName, id, campos) {
        if (!database || !database.nombre || !tableName || !IdColumName || !id || !campos) {
            console.log(`Parámetros recibidos: Database.nombre: ${database.nombre}, TableName: ${tableName}, IdColumName: ${IdColumName}, id: ${id}, Campos: ${JSON.stringify(campos)}`);
            console.error("Parámetros inválidos para actualizar un registro.");
            return { success: false, message: "Faltan parámetros para actualizar el registro." };
        }
            
        let dbConnection;
        try {
            dbConnection = await this.mysql.createConnection({
                host: "localhost",
                database: database.nombre,
                user: "root",
                password: "",
                port: "3306",
            });
            
            // Construir la consulta SQL
            const camposActualizados = Object.entries(campos)
                .map(([key, value]) => `${key} = ?`)
                .join(', ');
    
            const valores = Object.values(campos);
            const sql = `UPDATE ${tableName} SET ${camposActualizados} WHERE ${IdColumName} = ?`;
    
            // Ejecutar la consulta
            const [result] = await dbConnection.execute(sql, [...valores, id]);
    
            if (result.affectedRows > 0) {
                console.log(`Registro con id ${id} actualizado en la tabla ${tableName} en la base de datos ${database.nombre}.`);
                return { success: true, message: `Registro con id ${id} actualizado exitosamente.` };
            } else {
                console.log(`Registro con id ${id} no encontrado en la tabla ${tableName}.`);
                return { success: false, message: `Registro con id ${id} no encontrado.` };
            }
        } catch (error) {
            console.error("Error al actualizar el registro: ", error);
            return { success: false, message: `Error al actualizar el registro: ${error.message}` };
        } finally {
            if (dbConnection) {
                await dbConnection.end(); // Cerrar la conexión a la base de datos
                console.log("Conexión cerrada de la base de datos " + database.nombre);
            }
        }
    }
    
    
    async editarTabla(database, tableName, columns) {
        let dbConnection;
        try {
            dbConnection = await this.mysql.createConnection({
                host: "localhost",
                database: database.nombre,
                user: "root",
                password: "",
                port: "3306",
            });
    
            // Obtener la estructura actual de la tabla
            const [existingColumns] = await dbConnection.query(`SHOW COLUMNS FROM ${tableName}`);
    
            // Generar consultas SQL para agregar, modificar o eliminar columnas
            const columnNames = columns.map(col => col.name);
            const existingColumnNames = existingColumns.map(col => col.Field);
    
            const columnsToAdd = columns.filter(col => !existingColumnNames.includes(col.name));
            const columnsToDrop = existingColumns.filter(col => !columnNames.includes(col.Field));
            const columnsToModify = columns.filter(col => existingColumnNames.includes(col.name));
    
            // Agregar columnas
            for (const col of columnsToAdd) {
                let sql = `ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.datatype}`;
                if (col.pk) sql += ' PRIMARY KEY';
                if (col.nn) sql += ' NOT NULL';
                await dbConnection.query(sql);
            }
    
            // Eliminar columnas
            for (const col of columnsToDrop) {
                await dbConnection.query(`ALTER TABLE ${tableName} DROP COLUMN ${col.Field}`);
            }
    
            // Modificar columnas
            for (const col of columnsToModify) {
                let sql = `ALTER TABLE ${tableName} MODIFY COLUMN ${col.name} ${col.datatype}`;
                if (col.pk) sql += ' PRIMARY KEY';
                if (col.nn) sql += ' NOT NULL';
                await dbConnection.query(sql);
            }
    
            return { success: true, message: `Tabla "${tableName}" editada exitosamente.` };
        } catch (error) {
            console.error("Error al editar la tabla: ", error);
            return { success: false, message: `Error al editar la tabla: ${error.message}` };
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }
    }
    

    async obtenerColumnas(database, table) {
        console.log("Entrando a /editarTabla...");
        
        if (!database || !database.nombre || !table) {
            console.log(`Se ha recabado mal la información mira: database ${database}, database.nombre: ${database?.nombre}, table: ${table}`);
            return { success: false, message: "Faltan parámetros para obtener las columnas." };
        }
    
        let dbConnection;
        try {
            dbConnection = await this.mysql.createConnection({
                host: "localhost",
                database: database.nombre,
                user: "root",
                password: "",
                port: "3306",
            });
    
            const sql = `DESCRIBE ${table}`;
            const [fields] = await dbConnection.execute(sql);
    
            console.log(`Tabla: "${table}" seleccionada en la base de datos "${database.nombre}". Columnas: `, fields);
            
            return { success: true, message: `Datos de tabla "${table}" seleccionados exitosamente.`, columnas: fields };
    
        } catch (error) {
            console.error("Error al obtener las columnas: ", error);
            return { success: false, message: `Error al obtener las columnas: ${error.message}` };
    
        } finally {
            if (dbConnection) {
                await dbConnection.end(); // Cerrar la conexión a la base de datos
                console.log("Conexión cerrada de la base de datos " + database.nombre);
            }
        }
    }
    


}
module.exports = DatabaseDB;