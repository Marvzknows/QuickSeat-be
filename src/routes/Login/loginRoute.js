import express from "express";
import { LoginController } from "../../controllers/loginController.js";

const loginRouter = express.Router();

loginRouter.post('/login', LoginController);

export default loginRouter;
