// Controllers: Making the functions that makes the query
import db from "../database/db.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; 

export const SignupController = async (req, res) => {
    const { first_name, last_name, username, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const dateCreated = new Date().toISOString().slice(0, 10);
        const query = `INSERT INTO user_accounts (user_id, first_name, last_name, username, password, date_created)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const response = await db.query(query, [userId, first_name, last_name, username, hashedPassword, dateCreated]);
        if (response[0].affectedRows > 0) {
            res.status(201).json({ message: "User registered successfully", userId: userId });
        } else {
            res.status(400).json({ message: "User registered failed" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
}