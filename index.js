require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
mongoose.set("strictQuery", false);

// for encrypting password
const saltRounds = 10;

// routes

// register user
app.post("/signup/user", async (req, res) => {
  const { email, password } = req.body;
  //   create hash for password
  const hashPassword = bcrypt.hashSync(password, saltRounds);

  let newUser = new User({
    email: email,
    password: hashPassword,
  });

  await User.create(newUser)
    .then(() => res.status(201).send("success"))
    .catch((err) => {
      res.status(403).send("failed to register");
    });
});

// login user
app.post("/signin/user", async (req, res) => {
  const { email, password } = req.body;

  //   first check if user exist
  let foundUser = await User.findOne({ email: email });

  //   if user doesn't exist
  if (foundUser == undefined) {
    res.status(404).send("user doesn't exist");
  } else {
    // Load hash from your password DB.
    let hash = foundUser.password;

    let isPasswordMatched = bcrypt.compareSync(password, hash); // true
    //   check username is true or not
    if (isPasswordMatched) {
      // set token
      const token = jwt.sign(
        { id: foundUser._id, email: foundUser.email },
        "SECRET",
        {
          // expiration
          expiresIn: "7 days",
        }
      );

      //   send token as response
      res.send(token);
    } else {
      res.status(401).send("password doesn't match");
    }
  }
});

// get all user data , for test purpose
app.get("/getUsers", async (req, res) => {
  let users = await User.find();
  res.send(users);
});

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("db connected");
  app.listen(process.env.PORT, () => {
    console.log("server running on port", process.env.PORT);
  });
});
