import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Aadharshila",
  password: "PRARABDHSONI2005",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




app.get("/", async (req, res) => {
  const result = await db.query("SELECT country FROM visited_countries");
  let countries = [];
  result.rows.forEach((countrys) => {
    countries.push(countrys.country);
  });
  console.log(result.rows);
  res.render("index.ejs", {countries: countries, total: countries.length});
  db.end();
});

app.post("/add", async (req, res) =>{
  const  input = req.body["country"];

  const result = await db.query(
    "SELECT flag FROM countries WHERE name = $1",
    [input]
  );
  if (result.rows.length !== 0){
    const data = result.rows[0];
    const countrycode = data.flag;

    await db.query("INSERT INTO visited_countries(country) VALUES($1)",[
      countrycode,
    ]);
    res.redirect("/");
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
