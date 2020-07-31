//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.set("view engine", "ejs");

/////////////////////////Created DB collection model////////////////////////////
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
const User = mongoose.model("User", userSchema);

////////////////////////////The Get requests /////////////////////////////////////
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

//above, we dont see a get request to the /secrets route. Its because we dont want anybody to access it until they have not regsitered

///////////////////////////////Post Requests ////////////////////////////////////////////
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save(function (err) {
    if (!err) {
      res.render("secrets");
    } else {
      res.send(err);
    }
  });
});

app.post("/login", function (req, res) {
  const loginMail = req.body.username;
  const loginPass = req.body.password;
  User.findOne({ email: loginMail }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser && foundUser.password === loginPass) {
        res.render("secrets");
      } else {
        res.send("Account doesnt exist");
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server at port 3000");
});
