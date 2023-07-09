const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();


//User model
const User = require("../models/User");



//Login Page
router.get("/login", (req,res) => res.render("login"));

//Register Page
router.get("/register", (req,res) => res.render("register"));

//Register Handle
router.post("/register",(req,res) =>{
    let {name, email,password,password2} = req.body;
    let error = [];

    //required fields
    if(  !name || !email || !password || !password2){
        error.push({ msg : "Please fill all the fields"})
    }

    //passwords match
    if( password != password2){
        error.push({msg : "Password don't match"})
    }

    //pasword length
    if(password.length < 6){
        error.push({ msg : "Enter password of more than 6 characters"})
    }

    if (error.length > 0){
        res.render("register",{
            error,
            name,
            email,
            password,
            password2
        })
    }else{
        User.findOne( {email: email})
        .then( user => {
            if(user){
                //user exists
                error.push({ msg : "Email is already registered"})
                res.render("register",{
                    error,
                    name,
                    email,
                    password,
                    password2
                })
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                })
                //hash password
                bcrypt.genSalt(10 , (err, salt)=>{
                  bcrypt.hash(newUser.password, salt , (err, hash) =>{
                        if(err)  throw(err)
                        //hashed password
                        newUser.password = hash;
                        //user save
                        newUser.save()
                        .then(user =>{
                            req.flash("success_msg", "You are now registered and can log in");
                            res.redirect("/users/login")
                        }).catch(err => console.log(err));
                    })
                })
            }   
        })
    }
})

router.post("/login",async(req,res) =>{
    
    
    try {
            let {email,password} = req.body;
        
        
              let userCreated = await User.findOne({
                email:email
              }); 
                  
              const validPassword = await bcrypt.compare(password,userCreated.password)
              console.log(validPassword);
              if (validPassword) {
               return res.redirect("dashboard")
              }
              req.flash("error" , "Incorrect Password")
              res.render("login")
            //   else {
            //    return (req, res, next) =>{
            //      req.flash("error" , "Incorrect Password")
            //      res.render("login")
            //    }
            //   }
              
        
            
           } catch (error) {
            console.log(error);
           }
        });


        router.get("/logout",(req, res) =>{
           
            req.flash("success_msg" , "You have been logged out");
            res.redirect("/users/login");
        });


module.exports = router;