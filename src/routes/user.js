const { json } = require("body-parser");
const express = require("express");
const userSchema = require("../models/user");
const userProSchema = require("../models/userPro");
const bcrypt = require('bcrypt')

const router = express.Router();

const salt = bcrypt.genSaltSync(10)
// router.get("/users", (req, res) => {
//   res.json({ "toma users": "pam paam" });
// });

router.post("/users", (req, res) => {
  const user = userSchema(req.body);
  user
    .save()
    .then((data) => res.json(data))
    .catch((e) => res.json({ message: e }));
});

router.get("/allusers", (req, res) => {
  userProSchema
    .find()
    .then((data)=> res.status(200).json(data.map(d=>{
      const dt = {id:d._id, user: d.username}
      return dt
    })))
    .catch((e) => res.jstatus(404).son({ message: e }));
});

router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  let logged = true;
  userProSchema
    .findById(id)
    .then((data) => {
      const completeData = { logged: logged, data, pass: data.password };
      res.json(completeData);
    })
    .catch((e) => res.json({ message: e }));
});

router.post("/register", (req, res) => {
  const hashedPass = bcrypt.hashSync(req.body.password, salt)
  const userb = {
    username: req.body.username,
    password: hashedPass,
  };

  const sign = userProSchema(userb);
  sign
    .save()
    .then((data) => res.status(201).json({ UserCreated: data.username} ))
    .catch((e) => res.status(404).json({ error : e.message }));
}); 

router.post("/login", async (req, res) => {
  const username = await req.body.username;
  const password = await bcrypt.hashSync(req.body.password,salt);
  let logged = false;
  await userProSchema
    .find()
    .then(async (data) => {
      const user = await data.filter(
        (usera) => usera.username == username && usera.password == password
        
      );
      let u;
      let p;
      user.length > 0
        ? (u = user[0].username) &&
          (p = user[0].password) &&
          res.status(200).json({
            username: u,
            logged: (logged = true),
          })
        : res.status(401).json({
            message: "usuario o contraseña incorrecto",
            logged : false
          })
    })
    .catch((error) => json({ message: error }));
});

module.exports = router;
