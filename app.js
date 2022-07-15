// Dependancies LMAOO

const express = require("express");
const session = require("express-session");
const hbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const path = require("node:path");
const app = express();

// connect to database
// Local database, because lazy
mongoose.connect("mongodb://localhost:27017/node_auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// handlebars
app.engine("hbs", hbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
// use env variables in prod env
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
