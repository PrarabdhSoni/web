import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const _dirname = dirname(fileURLToPath(import.meta.url));
const port = 3001;


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Aadharshila School",
    password: "PRARABDHSONI2005",
    port: 5432,
});
db.connect();
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req,res) => {
  res.render("student.ejs");
})

app.get("/all_students", async (req,res) =>{
  const studentData = await db.query("SELECT * FROM students");
  res.render("All_students.ejs", studentData);
  console.log(studentData);
})

app.get("/Addmission", (req,res) => {
  res.render("index.ejs")
})
app.post("/addmission", async (req, res) => {
    const student_name = req.body["Student_Name"];
    const registration_no = req.body["Registration_Number"];
    const class_name = req.body["class"];
    const date_of_addmission = req.body["Date_Of_Addmission"];
    const picture = req.body["Picture"];
    const discount_fees = req.body["Discount_In_Fees"];
    const date_of_birth = req.body["Date_Of_Birth"];
    const gender = req.body["Gender"];
    const address = req.body["Address"];
    const cast_of_student = req.body["Cast"];
    const father_name = req.body["Father_Name"];
    const father_mobile_no = req.body["Father_Mobile_No."];
    const father_occupation = req.body["Father_Occupation"];
    const mother_name = req.body["Mother Name"];
    const mother_mobile_no = req.body["Mobile_No."];
    const mother_occupation = req.body["Occupation"];
    const password = req.body["password"];
    console.log(password);
    // items.push({title: item});
    try {
      await db.query("INSERT INTO students(student_name, registration_no, class_name, date_of_addmission, picture, discount_fees, date_of_birth, gender, address, cast_of_student, father_name, father_mobile_no, father_occupation, mother_name, mother_mobile_no, mother_occupation) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16)", [student_name, registration_no, class_name, date_of_addmission, picture, discount_fees, date_of_birth, gender, address, cast_of_student, father_name, father_mobile_no, father_occupation, mother_name, mother_mobile_no, mother_occupation]);
    } catch (err) {
      console.log(err);
    } 
    res.redirect("/");
});

app.get("/print", async (req, res) => {
  try {
    const id = Number.parseInt(req.query.id);
    if (isNaN(id)) {
      return res.status(400).send("<center><h1>Invalid ID format</h1><center>"); // Handle invalid ID
    }
    const studentData = await db.query("SELECT * FROM students WHERE registration_no = $1", [id]);
    const student = studentData.rows[0];  
    if(!student){
      return res.status(404).send("<center><h1>Student not found</h1><center>");
    }

    if (id == student.registration_no){
      res.render("index2.ejs", student);
    }
  }catch (err) {
    console.log(err);
  }
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
