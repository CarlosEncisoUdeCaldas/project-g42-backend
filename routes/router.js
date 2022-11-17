const express = require("express");
const { createUser, getUsers, updateUser, deleteUser, userLogin } = require("../controllers/UserController");
const router = express.Router();

//Ruta de prueba
router.get("/", (req, res) => {
  res.send({ message: "Hola Mundo. ruta principal" });
});

//Operaciones CRUD
router.post("/createUser", createUser);
router.get("/get-users", getUsers);
router.put("/update-user/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

router.post("/login", userLogin); //Ruta de login usuario

module.exports = router