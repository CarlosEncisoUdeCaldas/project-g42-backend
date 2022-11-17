const User = require("../models/UserModel");

const createUser = (req, res) => {
  const { body } = req;
  const newUser = new User({
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email.toLowerCase(),
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
};

const updateUser = (req, res) => {
  const idToUpdate = req.params.id;
  const { body } = req;
  const userToUpdate = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email.toLowerCase(),
    password: body.password,
  };

  User.findOne({ email: userToUpdate.email }, (err, userFinded) => {
    if (err) {
      res.status(500).send("Error del servidor: " + err);
    } else if (userFinded) {
      if (userFinded.id !== idToUpdate) {
        res.send({
          message: "Email ya esta en uso con otro usuario",
          user: userFinded,
        });
      } else {
        userFindAndUpdate( idToUpdate , userToUpdate , res ) //funcion para actualizar
      }
    } else {
        userFindAndUpdate( idToUpdate , userToUpdate, res ); 
    }
  });
};

const getUsers = (req, res) => {
  User.find({}, (err, docs) => {
    if (docs) {
      res.status(200).send({ docs });
    } else if (!docs) {
      res.send({ message: "No hay documentos en la coleccion" });
    } else {
      res.send({ message: `Error del servidor: ${err}` });
    }
  });
};

const deleteUser = (req, res) => {
  const idToDelete = req.params.id;

  //declaramos la query findOneAndRemove para eliminar el usuario
  User.findOneAndRemove({ _id: idToDelete }, (err, userDeleted) => {
    if (err) {
      res.send({ message: "Error del servidor: " + err });
    } else if (!userDeleted) {
      res.send({ message: "Usuario no existe en la base de datos" });
    } else {
      res.send({ message: "Usuario eliminado con éxito", user: userDeleted });
    }
  });
};

//ToDo: loguear el usuario
const userLogin = (req, res) => {
  res.send({ message: "Login On" });
};

//funcion para actualizar usuario en el endPoint update
function userFindAndUpdate(id, user, res) {
  User.findByIdAndUpdate(id, user, { new: true }, (err, userUpdated) => {
    if (err) {
      res.send({ message: `Error del servidor: ${err}` });
    } else if (!userUpdated) {
      res.send({ message: "Usuario no encontrado" });
    } else {
      res.status(200).send({
        message: "Usuario actualizado con exito",
        user: userUpdated,
      });
    }
  });
}

module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
  userLogin,
};
