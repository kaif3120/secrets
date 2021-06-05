
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const encrypt = require("mongoose-encryption");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = mongoose.model("User", userSchema);


app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register");
})


app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  if(!err){
    const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function(err){
        if(!err){
          res.render("secrets");
        }else{
          console.log(err);
        }
      });
         }else{
            res.send(err);
              }
       });
});


app.post("/login",function(req,res){

    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result === true){
              res.render("secrets");
            }else{
             res.send("incorrect password");
            }
         });
        }else{
          res.send("user not found, please register")
        }
      }
    });

  });







app.listen(3000, function(){
  console.log("serve started at 3000");
})
