require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');
mongoose.connect("mongodb://localhost:27017/secretDB");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});
const secret = process.env.secret;
userSchema.plugin(encrypt, { secret:secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);
app.get("/",function(req,res){
    res.render("home");
    console.log(process.env.secret);
});
app.get("/login", (req,res) => {
    res.render("login");
});
app.get("/register", (req,res)=>{
    res.render("register");
});
app.post("/login", (req,res)=>{
    const name = req.body.username;
   const password = req.body.password;
    User.findOne({name: name}, function(err,founduser){
        if(err){
            console.log(err);
        }else if(founduser){
            if(founduser.password === password){
                console.log(founduser.password);
                res.render("secrets");
            }else{console.log("Your password is incorrect");
         res.render("login");
        }
        }else{
            res.redirect("/register");
        }
    })
});
app.post("/register",(req,res) =>{
    const name = req.body.username;
    const password = req.body.password;
    const user = new User({
        name: name,
        password:password
    });
    user.save();
    res.render("secrets");
})
app.listen(3000, function(){
    console.log("The app is listening at port 3000");
})