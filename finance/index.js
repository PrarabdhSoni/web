import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import env from "dotenv";
// import { hash } from "crypto";

const app = express();
const _dirname = dirname(fileURLToPath(import.meta.url));
const port = 4000;
const saltRounds = 10;
app.use(express.static("public"));
env.config();

const db = new pg.Client({
    user: process.env.USER_NAME,
    host: process.env.HOST_NAME,
    database: process.env.DATABASE_NAME,
    password: process.env.PASSWORD,
    port: process.env.PORT_NAME,
});
db.connect();  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req,res) =>{
    res.render(_dirname + "/views/index.ejs");
})

app.get("/sign_up", (req,res)=>{
    res.render(_dirname + "/views/sign_up.ejs")
})

app.post("/Sign_Up/dashboard", async (req, res) => {
    try {
        const emailg = req.body.user_email;
        const email = emailg.toLowerCase();
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

app.post("/login/dashboard", async (req,res) =>{
    try {
        const emailg = req.body.Email;
        const email = emailg.toLowerCase();
        const password = req.body.Password;    
        const check_result = await db.query("SELECT * FROM users WHERE email = $1",
        [email]
        );
        if (check_result.rows.length > 0) {
            const user = check_result.rows[0];
            const storedHashedPassword = user.password;
            bcrypt.compare(password, storedHashedPassword, (err, result) => {  
                if (err) {
                    console.log("Error comparing passwords:", err);
                } else{   
                    if (result) {
                        res.render(_dirname + "/views/welcome.ejs", {user})
                    }else {
                        res.send("incorrect password");
                    }
                }
            });
        }else{
            res.send("Not registered");
        }
    }catch (err) {
        console.log(err);
    } 
});

app.listen(port, () =>{
    console.log(`the srever is running in port. ${port}`);
});