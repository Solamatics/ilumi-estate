import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
dotenv.config();
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MONGODB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRouter);

app.listen(3000, () => {
  console.log(`Server listening on port: 3000`);
});
