const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static, path.join(__dirname, "/public"));
app.set("view engine", "ejs");
app.use("views", path.join(__dirname, "/views"));
require("dotenv").config();
const db = require("./server_db");
let authenticate_login = async (req) => {
  let user = req.body.username;
  let pass = req.body.password;
  let c = await db.collection("login");
  let coll = await c.find();
  for await (let col of coll) {
    if (col.username === user && col.password === pass) {
      return true;
    }
  }
  return false;
};
let authenticate_signup = async (req) => {
  let user = req.body.user;
  let pass = req.body.pass;
  let c = await db.collection("login");
  let coll = await c.find();
  for await (let col of coll) {
    if (
      col.username === user ||
      col.Name === req.body.Name ||
      col.Email === req.body.Email
    ) {
      return true;
    }
  }
  return false;
};
app.get("/app/login", (req, res) => {
  res.render("login", { msg: "" });
});
app.get("/app/register", (req, res) => {
  res.render("registeration");
});
app.post("/api/login", async (req, res) => {
  let com = await authenticate_login(req);
  if (com) {
    req.session.user = req.body.username;
    req.session.save();
    res.render("main", { name: req.session.user });
  } else {
    res.render("login", { msg: "Invalid Login" });
  }
});
app.post("/api/registration", async (req, res) => {
  let com = await authenticate_signup(req);
  let c = await db.collection("login");
  if (com) {
    res.render("registration", {
      error: "user already exists or username taken",
    });
  } else {
    c.insertOne({
      Name: req.body.Name,
      Designation: req.body.Designation,
      Email: req.body.Email,
      username: req.body.user,
      password: req.body.pass,
    });
    res.render("registration", { msg: "Done Added" });
  }
});

app.listen(process.env.APP_PORT, () => {
  console.log("Server Running");
});
