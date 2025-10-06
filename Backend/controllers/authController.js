import User from "../models/user.js";
import bcrypt from "bcrypt";
const registerUser =async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        //TODO Send verification email

        res.status(201).json({ message: "Verification email sent Please check your inbox" });

    } catch (error) {
        console.log(error);

        res.status(500).json({message: "Error in Register User Controller"});
    }
};



const loginUser =async (req, res) => {
    try {
        const { email, password } = req.body;
    } catch (error) {
        console.log(error);

        res.status(500).json({message: "Error in Login User Controller"});
    }
};

export {registerUser, loginUser};