//jshint esversion:6

// Confing the dotenv files

require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended : true
}));


// Create a coonection to the monogdb server using mongoose

mongoose.connect("mongodb://localhost:27017/userDB");

// Create a new user schema

const userSchema = new mongoose.Schema ({
    email : String,
    password : String
});

// Create a secret and encrypt the string
// This encrypt and decrypt automatically
// Level 2. Encryt the password

userSchema.plugin(encrypt,{secret : process.env.SECRET,encryptedFields : ['password']});

// Create new user model and collection

const User = new mongoose.model("User",userSchema);


// Route to the home page using ejs
app.get('/',function(req,res){
    res.render('home');
});

// Route to the login page using ejs
app.get('/login',function(req,res){
    res.render('login');
});

// Route to the register page using ejs
app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save(function(err){
        if(err)
            console.log('Found some error');
        else
            res.render('secrets');
    });

});

// Level 1. Authentication using email and password;
app.post('/login',function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        email : username
    },function(err,foundUser){
        if(err){
            console.log('Found some error while logging in.');
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    console.log("Login Successfully!");
                    res.render('secrets');
                }else{
                    console.log("Invalid password!");
                }
            }else{
                console.log("User not Found!");
            }
        }
    });

});




app.listen(3000,function(req,res){
    console.log("Connection started at port 3000!");
});