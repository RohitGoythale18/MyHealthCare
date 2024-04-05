const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Doctor = require('../model/doctor');

const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Incomplete content" });
        } else {
            const authUser = await User.findOne({ username });
            if (!authUser) {
                return res.status(404).json({ message: `User with username ${username} not found` });
            } else {
                const verify = await bcryptjs.compare(password, authUser.password);
                if (!verify) {
                    return res.status(401).json({ message: "Username or password incorrect" });
                } else {
                    const token = jwt.sign({ user: authUser }, process.env.SECRET_KEY, { expiresIn: "5h" });
                    res.cookie("authorization", `Bearer ${token}`);
                    return res.status(200).json({ token: `Bearer ${token}`, user: authUser, message: "Login successful" });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const doctorsignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Incomplete content" });
        } else {
            const authUser = await Doctor.findOne({ email });
            if (!authUser) {
                return res.status(404).json({ message: `Doctor with email ${email} not found` });
            } else {
                const verify = await bcryptjs.compare(password, authUser.password);
                if (!verify) {
                    return res.status(401).json({ message: "Email or password incorrect" });
                } else {
                    const token = jwt.sign({ user: authUser }, process.env.SECRET_KEY, { expiresIn: "5h" });
                    res.cookie("authorization", `Bearer ${token}`);
                    return res.status(200).json({ token: `Bearer ${token}`, user: authUser });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const signup = async (req, res) => {
    try {
        const { username, password, email, gender, age, location, phone } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Incomplete content" });
        } else {
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (!existingUser) {
                const hashedPassword = await bcryptjs.hash(password, 8);
                await User.create({
                    username,
                    password: hashedPassword,
                    email,
                    gender,
                    age,
                    location,
                    phone
                });
                return res.status(201).json({ message: "User created" });
            } else {
                return res.status(409).json({ message: "User already exists" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signin,
    signup,
    doctorsignin
};
