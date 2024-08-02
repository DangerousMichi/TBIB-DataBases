const express = require('express');
const router = express.Router();
const UsuarioClase = require("../clases/usuarioClase");
const UsuarioDB = require("../db/usuarioBD");
const DatabaseClase = require("../clases/databaseClase");
const DatabaseDB = require("../db/databaseBD");




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

  // router.get("/createDb", (req, res)=>{
  //   res.render("createDB");
  // })

  router.get("/agregarUsuario", (req, res)=>{
    res.render("login");
  })

  router.get("/crearTablas",(req,res) =>{
    res.render("crearTablas")
  })

  router.get("/mostrarDB" , (req,res) =>{
    res.render("showDBS")
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

   router.post("/crearNuevaDb", async (req, res) => {

    console.log(req.body);
    const database1 = new DatabaseClase(req.body);

    if (database1.nombre!=undefined) {
        const databaseDB = new DatabaseDB();
        databaseDB.nuevaDB(database1.obtenerDatos);
        res.render("createDBS", database1.obtenerDatos);
    } 
    else {
        res.render("error");
        console.error("Error al insertar datos en MySql: ", error);
    }

   })

   router.get('/createDB', async (req, res) => {
    try {
        const databaseDB = new DatabaseDB();
        const result = await databaseDB.mostrarDatabases();
        console.log("Result from mostrarDatabases:", result); // Verifica el resultado aquí
        res.render("createDB", { databases: result, error: null });
    } catch (error) {
        console.error("Error al mostrar las bases de datos: ", error);
        res.render('createDB', { databases: [], error: "Error al mostrar las bases de datos" });
    }
});

   module.exports = router;
