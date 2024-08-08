const express = require('express');
const router = express.Router();
const UsuarioClase = require("../clases/usuarioClase");
const UsuarioDB = require("../db/usuarioBD");
const DatabaseClase = require("../clases/databaseClase");
const DatabaseDB = require("../db/databaseBD");
const db = new DatabaseDB();





router.get('/', (req, res) => {
    res.render('wellcome'); // Renderizar la vista index.ejs
  });


  router.get("/signIn", (req, res)=>{
    res.render("signin");
  })

  router.get("/logIn", (req, res)=>{
    res.render("login");
  })

  router.get("/letsCreate", (req, res)=>{
    res.render("letsCreate");
  })

  router.get("/agregarUsuario", (req, res)=>{
    res.render("login");
  })

  router.get("/crearTablas",(req,res) =>{
    res.render("crearTablas")
  })

  router.get("/mostrarDB" , (req,res) =>{
    res.render("showDB")
  })

  router.post("/agregarUsuario", async (req, res) => {

   console.log(req.body);
    const usuario1 = new UsuarioClase(req.body);

    if (usuario1.nombre!=undefined && usuario1.correo!=undefined && usuario1.nombreUsuario!=undefined && usuario1.password!=undefined) {
        const usuarioDB = new UsuarioDB();
        usuarioDB.nuevoUsuario(usuario1.obtenerDatos);
        res.render("signin", usuario1.obtenerDatos);
    } 
    else {
        res.render("error");
        console.error("Error al insertar datos en MySql: ", error);
    }
   });

   router.get('/crearDB', async (req, res) => {
    try {
        const databaseDB = new DatabaseDB();
        const result = await databaseDB.mostrarDatabases();
        console.log("Result from mostrarDatabases:", result); // Verifica el resultado aquí
        res.render("crearDB", { databases: result, error: null });
    } catch (error) {
        console.error("Error al mostrar las bases de datos: ", error);
        res.render('crearDB', { databases: [], error: "Error al mostrar las bases de datos" });
    }
  });

   router.post("/crearNuevaDb", async (req, res) => {

    console.log(req.body);
    const database1 = new DatabaseClase(req.body);

    if (database1.nombre!=undefined) {
        const databaseDB = new DatabaseDB();
        await databaseDB.nuevaDB(database1.obtenerDatos);
        res.redirect("/crearDB");
    } 
    else {
        res.render("error");
        console.error("Error al insertar datos en MySql: ", error);
    }

   })


  router.post("/borrarDB", async (req, res) => {

    console.log(req.body);
    const database1 = new DatabaseClase(req.body);

    if (database1.nombre!=undefined) {
        const databaseDB = new DatabaseDB();

      try{
         await databaseDB.borrarDB(database1.obtenerDatos);
         res.redirect("/crearDB"); // Redirigir a la vista de bases de datos
     } catch (error) {
         console.error("Error al borrar la base de datos: ", error);
         res.render("error", { message: "Error al borrar la base de datos" });
     }
      }else {
        res.render("error");
        console.error("Nombre de base de datos no definido: ", error);
    }

   })

   router.get("/editarDB", async (req, res) => {
    const database1 = new DatabaseClase(req.query);
    console.log("Database object:", database1);
    const message = req.query.message || null; 

    try {
        const databaseDB = new DatabaseDB();
        const result = await databaseDB.mostrarTablas(database1);
        console.log("Result from mostrarTablas:", result);
        res.render("editarDB", { tables: result, database1: database1, message: message }); 
    } catch (error) {
        console.error("Error al mostrar las tablas de la base de datos seleccionada: ", error);
        res.render('crearDB', { tables: [], error: "Error al mostrar las tablas de la base de datos" });
    }
});

router.post('/editarDB', async (req, res) => {
    console.log(req.body);
    const database1 = new DatabaseClase(req.body);
    const message = null; // Inicializa message aquí

    if (database1.nombre !== undefined) {
        const databaseDB = new DatabaseDB();

        try {
            const result = await databaseDB.mostrarTablas(database1);
            console.log("Result from mostrarTablas:", result);
            res.render("editarDB", { tables: result, database1: database1, message: message, error: null });
        } catch (error) {
            console.error("Error al mostrar las tablas de la base de datos seleccionada: ", error);
            res.render('crearDB', { tables: [], error: "Error al mostrar las tablas de la base de datos" });
        }
    } else {
        res.redirect('/crearDB');
    }
});

  router.post('/crearTabla', async (req, res) => {
    const databaseNombre = req.body.DBNombre;
    const tableName = req.body.tableName;
    const { columnName, datatype, pk, nn } = req.body;

    const database1 = new DatabaseClase({nombre: databaseNombre});

    // Mapea las columnas en el formato adecuado
    const columns = columnName.map((name, index) => ({
        name: name,
        datatype: datatype[index],
        pk: pk[index] ? true : false,
        nn: nn[index] ? true : false,
    }));

    try {
        const databaseDB = new DatabaseDB();
        const result = await databaseDB.crearTabla(database1, tableName, columns);
        // Redirigir a la vista de editarDB con un mensaje de éxito o error
        res.redirect(`/editarDB?nombre=${encodeURIComponent(databaseNombre)}&message=${encodeURIComponent(result.message)}`);
      } catch (error) {
        console.error("Error en la creación de la tabla:", error);
        res.redirect(`/editarDB?nombre=${encodeURIComponent(databaseNombre)}&message=${encodeURIComponent("Error al crear la tabla.")}`);
    }
});

router.post('/borrarTab', async (req, res) => {
  const tableName = req.body.nombre; // Obtienes el nombre de la tabla a borrar
  const databaseNombre = req.body.DBNombre; // Asegúrate de que también recojas el nombre de la base de datos

  const database1 = new DatabaseClase({ nombre: databaseNombre });

  try {
      const databaseDB = new DatabaseDB();
      await databaseDB.borrarTabla(database1, tableName); // Asegúrate de que este método exista en tu clase DatabaseDB
      res.redirect(`/editarDB?nombre=${encodeURIComponent(databaseNombre)}&message=${encodeURIComponent("Tabla borrada exitosamente.")}`);
  } catch (error) {
      console.error("Error al borrar la tabla:", error);
      res.redirect(`/editarDB?nombre=${encodeURIComponent(databaseNombre)}&message=${encodeURIComponent("Error al borrar la tabla.")}`);
  }
});

router.get('/abrirTabla', async (req, res) => {
  const { database, table, message } = req.query;
  console.log(`Parametros recibidos: database=${database}, table=${table}`); // Agrega logs para verificar los parámetros

  if (!database || !table) {
    return res.status(400).send("Parámetros faltantes: nombre de la base de datos y nombre de la tabla son requeridos.");
  }

  try {
    const databaseDB = new DatabaseDB();
    const result = await databaseDB.abrirTabla({ nombre: database }, table);

    console.log("Datos a renderizar:", { 
      tableName: table,
      columnas: result.columnas,
      datos: result.datos,
      database: { nombre: database },
      message: message || null
    });    

    res.render('abrirTabla', {
      tableName: table,
      columnas: result.columnas,
      datos: result.datos,
      database: { nombre: database },
      message: message || null,
    });
  } catch (error) {
    console.error("Error al abrir la tabla:", error);
    res.status(500).send("Error al abrir la tabla: " + error.message);
  }
});


router.post('/abrirTab', async (req, res) => {
  const databaseNombre = req.body.DBNombre;
  const tableName = req.body.nombre;
  console.log("nombre de la tabla recuperado:", tableName);
  const database1 = new DatabaseClase({ nombre: databaseNombre });

  try {
      const databaseDB = new DatabaseDB();
      const result = await databaseDB.abrirTabla(database1, tableName);

      if (!result.columnas || result.columnas.length === 0) {
          throw new Error("No se obtuvieron columnas de la tabla.");
      }

      if (!result.datos) {
          result.datos = [];
      }

      res.render("abrirTabla", { database: database1, tableName: tableName, columnas: result.columnas, datos: result.datos, message: result.message });
  } catch (error) {
      console.error("Error al abrir la tabla:", error);
      res.render('abrirTabla', { tableName: tableName, columnas: [], datos: [], message: "Error al abrir la tabla." });
  }
});

router.get('/abrirTabla', (req, res) => {
  const dbNombre = req.query.DBNombre;
  const tableName = req.query.nombre;

  // Conectar a la base de datos y obtener los datos
  db.connect(dbNombre, (err, connection) => {
      if (err) throw err;
      
      const query = `SELECT * FROM ${tableName}`;
      connection.query(query, (err, results) => {
          if (err) throw err;

          const columnas = Object.keys(results[0]).map(col => ({ name: col }));
          res.render('abrirTabla', {
              database: { nombre: dbNombre },
              tableName: tableName,
              columnas: columnas,
              datos: results
          });
          connection.end();
      });
  });
});

router.post('/insertarRegistros', async (req, res) => {
  const { DBNombre, nombre, ...data } = req.body;
  const database = { nombre: DBNombre };
  
  try {
      const databaseDB = new DatabaseDB(); // Crear una instancia de DatabaseDB
      const resultado = await databaseDB.insertarDatos(database, nombre, data); // Usar la instancia creada
      res.redirect(`/abrirTabla?database=${DBNombre}&table=${nombre}&message=${encodeURIComponent(resultado.message)}`);
  } catch (error) {
      console.error("Error al insertar los datos:", error);
      res.redirect(`/abrirTabla?database=${DBNombre}&table=${nombre}&message=${encodeURIComponent('Error al insertar los datos: ' + error.message)}`);
  }
});

router.post('/actualizarRegistro', async (req, res) => {
  const { DBNombre, nombre, id, ...campos } = req.body;
  const databaseName = DBNombre; 
  const tableName = nombre;

  console.log(`id del Registro recuperado: ${id}`);
  console.log(`Datos recuperados del req.body en /actualizarRegistro: DBNombre: ${databaseName}, tableName: ${tableName}, idRegistro: ${id}, campos: ${JSON.stringify(campos)}`);

  try {
      // Llamar al método de actualización
      const result = await db.actualizarRegistro({ nombre: databaseName }, tableName, id, campos);

      if (result.success) {
          res.redirect(`/abrirTabla?database=${databaseName}&table=${tableName}`);
      } else {
          res.status(404).send(result.message);
      }
  } catch (error) {
      console.error("Error al actualizar el registro:", error);
      res.status(500).send("Error al actualizar el registro");
  }
});





router.post('/eliminarRegistro', async (req, res) => {
  const { id, DBNombre, nombre } = req.body;

  if (!id || !DBNombre || !nombre) {
      return res.status(400).send('Faltan parámetros.');
  }

  try {
      const database = { nombre: DBNombre };
      const tableName = nombre;

      const databaseDB = new DatabaseDB();
      const result = await databaseDB.borrarRegistro(database, tableName, id);

      if (result.success) {
        res.redirect(`/abrirTabla?database=${databaseName}&table=${tableName}`);
      } else {
          res.status(500).send(result.message);
      }
  } catch (error) {
      console.error('Error al eliminar el registro:', error);
      res.status(500).send('Error al eliminar el registro.');
  }
});


router.get("/editarTabla", async (req, res) => {
  const { database, table } = req.query;
  const database1 = new DatabaseClase({ nombre: database });

  try {
      const databaseDB = new DatabaseDB();
      const columnas = await databaseDB.obtenerColumnas(database1, table);
      res.render("editarTabla", { tableName: table, columnas: columnas, database1: database1 });
  } catch (error) {
      console.error("Error al cargar la tabla para edición: ", error);
      res.status(500).send("Error al cargar la tabla para edición: " + error.message);
  }
});


router.post("/editarTabla", async (req, res) => {
  const { DBNombre, tableName, columnName, datatype, pk, nn } = req.body;
  const database1 = new DatabaseClase({ nombre: DBNombre });

  const columns = columnName.map((name, index) => ({
      name: name,
      datatype: datatype[index],
      pk: pk ? pk.includes(String(index)) : false,
      nn: nn ? nn.includes(String(index)) : false,
  }));

  try {
      const databaseDB = new DatabaseDB();
      await databaseDB.editarTabla(database1, tableName, columns);
      res.redirect(`/editarDB?database=${DBNombre}&message=Tabla editada exitosamente`);
  } catch (error) {
      console.error("Error al editar la tabla: ", error);
      res.status(500).send("Error al editar la tabla: " + error.message);
  }
});




   module.exports = router;
