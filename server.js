//crear nuestra variable de tipo express
const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
const router = require('./routes/router') //importar las rutas de las API Rest - EndPoints

//conexion a la BD
const stringConnection = require("./db/dbConnection");
mongoose
  .connect(stringConnection)
  .then(() => console.log("Servidor MongoDB Up"))
  .catch((err) => console.log("Error de conexion: " + err));

//BodyParser proceso para convertir las request HTTP en formato json()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//permitir que app ejecute la const router
app.use("/api/v1", router);

//Levantar el servidor
app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
