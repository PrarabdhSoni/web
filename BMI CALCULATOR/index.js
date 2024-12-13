import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyparser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static("./"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.render(__dirname + "/index.html");
});

app.post("/submit", (req,res) =>{
    const height = req.body["height"];
    const weight = req.body["weight"];
    const bmi = (weight/(height**2)).toFixed(2);
    res.render(__dirname + "/index.ejs", {BMI:bmi});
})

app.listen(port, () =>{
    console.log(`the port number is : ${port}`);
})