const express = require("express");

const app = express();

const connectionDb = require("./configuration/connection");

const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const profile = new User(req.body);
  try {
    await profile.save();
    res.send("profile sign up successful");
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

app.patch("/user", async (req, res) => {
  const { id, ...update } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, update, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log("user after update--->", user);
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
