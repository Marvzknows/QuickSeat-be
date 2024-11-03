import express from "express";
import { SignupController } from "../../controllers/signupController.js";

const signupRouter = express.Router();

signupRouter.post('/signup', SignupController);

export default signupRouter;
