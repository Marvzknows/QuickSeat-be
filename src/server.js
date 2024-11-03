import express from "express";
import dotenv from "dotenv";
import signupRouter from "./routes/Signup/signupRoute.js"; 

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

app.use(express.json());

// #region Routes
app.use('/api', signupRouter)
// #endregion

app.listen(port, () => {
    console.log("Listening to port: ", port);
})