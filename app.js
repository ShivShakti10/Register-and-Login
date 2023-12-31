const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { default: mongoose } = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");


const app = express();





//DB
const db = require("./config/keys").mongoURI;

//DB CONNECT
mongoose.connect(db , {useNewUrlParser : true})
.then(() =>{
    console.log("Database connected successfully")
}).catch((err) =>{
    console.log(err)
});

// EJS
app.use(expressLayouts);
app.set( "view engine" , "ejs" );

//Bodyparser
app.use(express.urlencoded({ extended : false}))

//express session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true

}));

// //passport middleware
// app.use(passport.initialize());
// app.use(passport.session());



//flash
app.use(flash());

//global vars
app.use(( req, res, next) =>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})

//Routes
app.use("/", require("./routes/index"));
app.use("/users" , require("./routes/users"))






const PORT = process.env.PORT || 5000 ;
app.listen(PORT , console.log(`Server running on port ${PORT}` ))
