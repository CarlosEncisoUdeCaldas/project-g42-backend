console.log("Hola Mundo, grupo 42 Up!!");

//crear nuestra variable de tipo express
const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");

//conexion a la BD
const stringConnection = require("./db/dbConnection");
mongoose.connect(stringConnection);

//Importación del modelo User
const User = require("./models/UserModel");

//BodyParser proceso para convertir las request HTTP en formato json()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//crear el objeto para las rutas de las API Rest - EndPoints
const router = express.Router();

//ToDo: Las acciones que nos faltan por hacer
//Ruta de prueba
router.get("/", (req, res) => {
  res.send({ message: "Hola Mundo. ruta principal" });
});

//Operaciones CRUD
//EndPoint para Crear Usuario - C
router.post("/createUser", (req, res) => {
  const { body } = req;
  const newUser = new User({
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    password: body.password,
  });

  User.findOne({ email: newUser.email }, (err, userFinded) => {
    if (userFinded) {
      res.send({ message: "Email ya esta asignado a un usuario" });
    } else if (!userFinded) {
      //si userFinded es false guardamos el usuario
      newUser.save((err, userSaved) => {
        if (userSaved) {
          res.status(200).send({ message: "Usuario creado con éxito" });
        } else if (!userSaved) {
          res.send({ message: "Error al guardar usuario" });
        } else {
          res.status(500).send({ message: `Error del servidor: ${err}` });
        }
      });
    } else {
      res.send({ message: `Error del servidor: ${err}`, status: 500 });
    }
  });

  //Hay varias opciones para guardar un documento en la bd
  //opcion 1: guardando el usuario directamente, resultado undefined
  // newUser.save()

  // opcion 2: funcion callback como parametro - void
  // newUser.save( ( err , userSaved ) => {
  //     if(userSaved){
  //         res.status(200).send ( { message: 'Usuario creado con éxito' } )
  //     }else if(!userSaved){
  //         res.send ( { message: 'Error al guardar usuario' } )
  //     }else{
  //         res.status(500).send( { message: `Error del servidor: ${err}` } )
  //     }
  // })

  // opcion 3: usando una Promesa
  // newUser.save()
  //     .then( (userSaved) => res.status(200).send ( { message: 'Usuario creado con éxito', user: userSaved } ) )
  //     .catch( (err) => res.status(500).send( { message: `Error del servidor: ${err}` } ) )
});

//EndPoint para Leer Usuario - R
router.get("/get-users", (req, res) => {
  User.find({}, (err, docs) => {
    if (docs) {
      res.status(200).send({ docs });
    } else if (!docs) {
      res.send({ message: "No hay documentos en la coleccion" });
    } else {
      res.send({ message: `Error del servidor: ${err}` });
    }
  });
});

//EndPoint para Actualizar Usuario - U
router.put("/update-user/:id", (req, res) => {
  const idToUpdate = req.params.id;
  const { body } = req;
  const userToUpdate = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email.toLowerCase(),
    password: body.password,
  };

  User.findByIdAndUpdate(idToUpdate, userToUpdate, { returnDocument: 'after'}, (err, userUpdated) => { 
    if(err){
        res.send( {message: `Error del servidor: ${err}`})
    }else if(!userUpdated){
        res.send( { message: 'Usuario no encontrado'})
    }else{
        res.status(200).send( { message: 'Usuario actualizado con exito', user: userUpdated})
    }
  });
});

//Eliminar Usuario - D

//permitir que app ejecute la const router
app.use("/api/v1", router);

//Levantar el servidor
app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
