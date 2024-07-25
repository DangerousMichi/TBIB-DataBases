const express = require('express');
const app = express();
const rutas = require("./routes/rutas");
const path = require('path');

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));
app.use(express.static(path.join(__dirname, '/web')));
app.use(express.static(path.join(__dirname, '/SRC')));
app.use('/', rutas);

// Middleware
app.use(express.urlencoded({ extended: true }));
// Carpeta pública

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
