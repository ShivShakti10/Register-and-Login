const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { deserializeUser } = require("passport");



module.exports = function(passport){
    passport.use(new LocalStrategy({ usernameField: "email"}), (email, password, done) =>{
        User.findOne({email: email})
          .then(user =>{
            if(!user){
                return done(null, false, {msg: "Email is not registered"})
            }

            //password match
            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if(err) throw(err)

                if(isMatch){
                    return done(null , user)     
                }else{
                    return done(null, false, {msg : "Password Incorrect"})
                }
            });
          })
          .catch(err => console.log(err));
    })


    //serialize and deserialze user cookies for session
    passport.serializeUser((user, done) =>{
        done(null, user.id);
    })

    passport,deserializeUser((id, done) =>{
        User.findById(id, (err, user) =>{
            done(err, user);
        });
    });
}

