import db from "../database/db.js";
import bcrypt from 'bcrypt'; 
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const LoginController = async(req, res) => {
    const { username, password } = req.body;

    try {
        const query = `SELECT * FROM user_accounts WHERE username = ?`;
        const response = await db.query(query, [username]);
        const userData = response[0];
        const checkEncryptedPassword = bcrypt.compareSync(password, userData[0].password);
        if (userData && userData.length === 1 && checkEncryptedPassword) {
            // Generate Access token and return the user information
            const token = jwt.sign({ username: username, password: userData[0].password }, process.env.SECRET_KEY, {
                expiresIn: "1hr",
            });
            res.status(201).json({
                status: true,
                message: "Login Successfully",
                acces_token: token,
                user_information: userData[0]
              });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }

        
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }

}