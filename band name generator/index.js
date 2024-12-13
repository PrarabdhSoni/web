import express from "express";
import bodyparser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const _dirname = dirname(fileURLToPath(import.meta.url));

var bandname ="";

app.use(bodyparser.urlencoded({extended: true}));

function bandnamegenerator (req, res, next){
    console.log(req.body);
    bandname = req.body["street"] + req.body["pet"];
    next();
}

app.use(bandnamegenerator)

app.get("/", (req,res) =>{
    res.sendFile(_dirname + "/index.html");
})
app.post("/submit", (req,res) =>{
    res.send(`<h1>your band name is</h1> <h2>${bandname}</h2>`);
})


app.listen(port, () =>{
    console.log(`the port is: ${port}`);
})
