//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose  = require("mongoose");
const encrypt = require("mongoose-encryption");
const { log } = require("console");
const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String, 
    password: String,
});
// ! should add these before making a new collections in DB
userSchema.plugin(encrypt, {secret: process.env.SECRETS, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home")
});

app.get("/register", function(req, res) {
    res.render("register")
});

app.get("/login", function(req, res) {
    res.render("login")
})

////////////////////? Register Page
app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then( (noerr, err) => {
        if (noerr) {
            res.render("secrets")
        }else {
            console.log(err);
        }
    });
});

//////////////////? Login Page
app.post("/login", function(req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName})
    .then((foundUser, err) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        };

    });
})

app.listen(3000, function() {
    console.log(`Server is up and running in port 3000`);
})