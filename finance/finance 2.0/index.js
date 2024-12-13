import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
// import { strategy } from "passport-local";
import pkg from 'passport-local';
const LocalStrategy = pkg.Strategy;
const app = express();
const _dirname = dirname(fileURLToPath(import.meta.url));
const port = 4000;
const saltRounds = 10;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Finance",
    password: "PRARABDHSONI2005",
    port: 5432,
});
db.connect();  

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "TOPSECRETWORDS",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req,res) =>{
    res.render(_dirname + "/views/index.ejs");
})

app.get("/sign_up", (req,res)=>{
    res.render(_dirname + "/views/sign_up.ejs");
})



app.post("/Sign_Up/dashboard", async (req, res) => {
    try {
        const email = req.body.user_email;
        const password = req.body.user_Password;
        const user_name = req.body.user_Name;
        const phone = req.body.user_Phone;
        const check_result = await db.query("SELECT * FROM users WHERE email = $1",
        [email]
        );
        if (check_result.rows.length > 0) {
            res.send("Email is already registered. Try log In");
        }else{
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err){
                    console.log("problem in hashing the password", err);
                }else{
                    await db.query(
                        "INSERT INTO users (email, phone, user_name, password) VALUES ($1, $2, $3, $4)",
                        [email, phone, user_name, hash]
                    );
                    res.render(_dirname + "/views/welcome.ejs");
                }
            })
        }
    }catch (err) {
        console.log(err);
    } 
});

app.post("/login/dashboard", passport.authenticate("local", {
    successRedirect: _dirname + "/views/welcome.ejs",
    failureRedirect: _dirname + "/views/index.ejs",
}));

app.get("/dashboard", (req,res)=>{
    if (req.isAuthenticated()){
        res.render(_dirname + "/views/welcome.ejs")
    }else{
        res.render(_dirname + "/views/index.ejs")
    }
})


passport.use(new LocalStrategy (async function verify(Email, Password, cb){
    try {   
        const check_result = await db.query("SELECT * FROM users WHERE email = $1",
        [Email]
        );
        if (check_result.rows.length > 0) {
            const user = check_result.rows[0];
            const storedHashedPassword = user.password;
            bcrypt.compare(Password, storedHashedPassword, (err, result) => {  
                if (err) {
                    return cb(err);
                } else{   
                    if (result) {
                        return cb(null, user);
                    }else {
                        return cb(null, false);
                    }
                }
            });
        }else{
            return cb("user not found");
        }
    }catch (err) {
        console.log(err);
    } 
}))


passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((user, cb) => {
    cb(null, user);
});


app.listen(port, () =>{
    console.log(`the srever is running in port. ${port}`);
});