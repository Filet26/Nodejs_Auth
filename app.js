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
// mongoose.connect("mongodb://localhost/node_auth", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose
  .connect("mongodb://localhost/node_auth")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", UserSchema);

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

// passport stuff
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // setup user model
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new localStrategy(function (username, password, done) {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          return done(err);
        }
        if (res === false) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      });
    });
  })
);

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.listen(8080, () => {
  console.log("App listening on port 8080");
});
