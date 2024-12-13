import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import {fileURLToPath} from "url";

const app = express();
const _dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("./"));



const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const symbols = ['!', '#', '$', '%', '&', '(', ')', '*', '+']

app.get("/", (req,res) =>{
    res.sendFile(_dirname + "/HI.html");
})

app.post("/submit", (req,res) =>{
    const nr_letters = req.body["letter"];
    const nr_numbers = req.body["number"];
    const nr_symbols = req.body["symbols"];
    res.render(_dirname + "/index.ejs",{letters,numbers,symbols,nr_letters,nr_numbers,nr_symbols});
})

app.listen(port, () =>{
    console.log(`your port number is ${port}`);
})