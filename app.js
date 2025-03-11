const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Student = require("./model/Student");

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Home Route
app.get("/", (req, res) => {
  res.render("index");
});

// Read All Students
app.get("/read", async (req, res) => {
  try {
    let students = await Student.find();
    res.render("read", { students });
  } catch (error) {
    res.status(500).send("Error fetching students");
  }
});

// Create a Student
app.post("/create", async (req, res) => {
    const { rollNo, name, degree, city } = req.body;
    let newStudent = await Student.create({ rollNo, name, degree, city });
    res.redirect("/read");
});

// Edit Student Form
app.get("/edit/:id", async (req, res) => {
  try {
    let student = await Student.findOne({_id:req.params.id});
    res.render("edit", { student });
  } catch (error) {
    res.status(500).send("Error fetching student");
  }
});

// Update Student
app.post("/update/:id", async (req, res) => {
  try {
    const { rollNo, name, degree, city } = req.body;
    await Student.findOneAndUpdate({_id:req.params.id},{ rollNo, name, degree, city } ,{new:true});
    res.redirect("/read");
  } catch (error) {
    res.status(500).send("Error updating student");
  }
});

// Delete Student
app.get("/delete/:id", async (req, res) => {
  try {
    await Student.findOneAndDelete({_id:req.params.id});
    res.redirect("/read");
  } catch (error) {
    res.status(500).send("Error deleting student");
  }
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));


















