const express = require("express");

const app = express();

const connectionDb = require("./configuration/connection");

const User = require("./models/user");

const validateSignUp = require("./utils/validators");

const cookieParser = require("cookie-parser");

const userAuth = require("./utils/middleware");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);
    const { password, ...rest } = req.body;
    const passwordHash = await User.hashPassword(password);
    await new User({ ...rest, password: passwordHash }).save();
    res.send("profile sign up successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email }).select("+password");

    if (!userExists) {
      throw new Error("Invalid credentials");
    }

    const verify = await userExists.validatePassword(password);
    if (!verify) {
      throw new Error("Invalid credentials");
    }

    const token = await userExists.getJWT();
    res.cookie("userToken", token);
    res.send("Login successful");
  } catch (error) {
    res.status(401).send(error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/sendRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " " + "sent a request");
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const feed = await User.find({});
    if (feed.length === 0) {
      return res.send("no users found");
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
      return res.send(`no users found with age ${req.body.Age}`);
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
  const id = req.params?.id;

  const allowedUpdates = ["gender", "skills", "photoUrl"];

  const updateValid = Object.keys(req.body).every((items) =>
    allowedUpdates.includes(items),
  );

  try {
    if (!updateValid) {
      throw new Error("update not allowed");
    }
    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.send("update failed");
    }
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
