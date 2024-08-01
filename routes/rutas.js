const express = require('express');
const router = express.Router();
const UsuarioClase = require("../clases/usuarioClase");
const UsuarioDB = require("../db/usuarioBD");


router.get('/', (req, res) => {
    res.render('wellcome'); // Renderizar la vista index.ejs
  });

  module.exports = router;

  router.get("/signIn", (req, res)=>{
    res.render("signin");
  })

  router.get("/logIn", (req, res)=>{
    res.render("login");
  })

  router.get("/createDb", (req, res)=>{
    res.render("createdb");
  })


  router.get("/agregarUsuario", (req, res)=>{
    res.render("login");
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

  