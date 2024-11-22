import express from "express";
import dotenv from "dotenv";
import signupRouter from "./routes/Signup/signupRoute.js"; 
import loginRouter from "./routes/Login/loginRoute.js";
import moviesRouter from "./routes/movies/moviesRoute.js";
import cors from 'cors';

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

app.use(express.json());
app.use(cors()); // Allow requests from frontend

// Signup & Login Routes
app.use('/api', signupRouter);
app.use('/api', loginRouter);

// Movies
app.use('/api', moviesRouter);

app.listen(port, () => {
    console.log("Listening to port: ", port);
})