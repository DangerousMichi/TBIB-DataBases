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
      const { DBNombre, tableName } = req.body;
    const columnNames = req.body.columnName || [];
    const dataTypes = req.body.datatype || [];
    const pks = req.body.pk || [];
    const nns = req.body.nn || [];

    if (!DBNombre || !tableName) {
        return res.status(400).send('Faltan parámetros.');
    }

    console.log("Datos recuperados por /crearTabla: ", { DBNombre, tableName, columnNames, dataTypes, pks , nns} );

    const columns = columnNames.map((name, index) => {
        return {
            name,
            datatype: dataTypes[index],
            pk: pks[index] === 'on',
            nn: nns[index] === 'on'
        };
    });

    const database = { nombre: DBNombre };

    const databaseDB = new DatabaseDB();
    const result = await databaseDB.crearTabla(database, tableName, columns);


      if (result.success) {
        res.redirect(`/editarDB?nombre=${encodeURIComponent(DBNombre)}&message=${encodeURIComponent("Tabla creada exitosamente.")}`);
      } else {
          res.status(500).send(result.message);
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
  const { DBNombre, nombre, IdColumName , id, ...campos } = req.body;
  const database = { nombre: DBNombre };
  const tableName = nombre;

  console.log(`id del Registro recuperado: ${id}`);
  console.log(`Nombre de la columna id recuperado: ${IdColumName}`);
  console.log(`Datos recuperados del req.body en /actualizarRegistro: DBNombre: ${DBNombre}, tableName: ${tableName}, idRegistro: ${id}, campos: ${JSON.stringify(campos)}`);

  try {
      // Llamar al método de actualización
      const result = await db.actualizarRegistro(database , tableName, editar, id, campos);

      if (result.success) {
          res.redirect(`/abrirTabla?database=${DBNombre}&table=${tableName}`);
      } else {
          res.status(404).send(result.message);
      }
  } catch (error) {
      console.error("Error al actualizar el registro:", error);
      res.status(500).send("Error al actualizar el registro");
  }
});





router.post('/eliminarRegistro', async (req, res) => {
  const { DBNombre, nombre, IdColumName, id } = req.body;

  if ( !DBNombre || !nombre || !IdColumName || !id ) {
      return res.status(400).send('Faltan parámetros.');
  }

  console.log("datos recuperados:", { DBNombre, nombre, IdColumName, id } );

  try {
      const database = { nombre: DBNombre };
      const tableName = nombre;

      const databaseDB = new DatabaseDB();
      const result = await databaseDB.borrarRegistro(database, tableName, IdColumName , id);

      if (result.success) {
          res.redirect(`/abrirTabla?database=${DBNombre}&table=${tableName}`);
      } else {
          res.status(500).send(result.message);
      }
  } catch (error) {
      console.error('Error al eliminar el registro:', error);
      res.status(500).send('Error al eliminar el registro.');
  }
});

router.post("/editTab", async (req, res) => {
  const { DBNombre, nombre } = req.body;
  const database1 = new DatabaseClase({ nombre: DBNombre });

  try {
      const databaseDB = new DatabaseDB();
      res.redirect(`/editarTabla?database=${DBNombre}&table=${nombre}&message=Tabla disponible para editar`);
  } catch (error) {
      console.error("Error al editar la tabla: ", error);
      res.status(500).send("Error al editar la tabla: " + error.message);
  }
});

router.get("/editarTabla", async (req, res) => {
  const { database, table } = req.query;
  const database1 = new DatabaseClase({ nombre: database });
  
  try {
      const databaseDB = new DatabaseDB();
      const result = await databaseDB.obtenerColumnas(database1, table);
      if (result.success) {
          res.render("editarTabla", { tableName: table, columnas: result.columnas, database1: database1 });
      } else {
          res.status(404).send(result.message);
      }
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
      res.redirect(`/abrirTabla?database=${DBNombre}&table=${tableName}&message=Tabla editada exitosamente`);
  } catch (error) {
      console.error("Error al editar la tabla: ", error);
      res.status(500).send("Error al editar la tabla: " + error.message);
  }
});





   module.exports = router;
