const express = require("express");
const app = express();
const connectionDb = require("./configuration/connection");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userRoutes");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
