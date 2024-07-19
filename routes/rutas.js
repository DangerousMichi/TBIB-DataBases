const express = require('express');
const router = express.Router();
const UsuariosClase = require("../clases/usuarioClase");



router.get('/', (req, res) => {
    res.render('wellcome'); // Renderizar la vista index.ejs
  });

  module.exports = router;

router.get("/signIn", (req, res)=>{
  res.render("sign_In");
})