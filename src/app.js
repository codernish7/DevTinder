const express = require("express");

const app = express();

const connectionDb = require("./configuration/connection");

const User = require("./models/user");

const validateSignUp = require("./utils/validators");

const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    req.body.password = passwordHash;
    await new User(req.body).save();
    res.send("profile sign up successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email }).select("+password");
    const verify = await bcrypt.compare(password, userExists.password)
    if (userExists && verify) {
      res.send("login successful");
    } else {
      res.status(400).send("invalid credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const feed = await User.find({});
    if (feed.length === 0) {
      return res.status(400).send("no users found");
    }
    res.send(feed);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.get("/user", async (req, res) => {
  try {
    const result = await User.find({ age: req.body.Age });
    if (result.length === 0) {
      return res.status(400).send(`no users found with age ${req.body.Age}`);
    }
    res.send(result);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.send("user deleted");
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user/:id", async (req, res) => {
  const { ...update } = req.body;
  const id = req.params?.id;

  const allowedUpdates = ["gender", "skills", "photoUrl"];

  const updateValid = Object.keys(update).every((items) =>
    allowedUpdates.includes(items),
  );

  try {
    if (!updateValid) {
      throw new Error("update not allowed");
    }
    await User.findByIdAndUpdate(id, update, { runValidators: true });
    res.send("user updated");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

connectionDb()
  .then(() => {
    console.log("connected to database");
    app.listen(5000, () => {
      console.log("server is listening");
    });
  })
  .catch((err) => {
    console.log(err);
  });
