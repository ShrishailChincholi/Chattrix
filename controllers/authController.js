const User = require("../models/User");
const bcrypt = require("bcryptjs");

// SHOW REGISTER PAGE
exports.getRegister = (req, res) => {
    if (req.session.user) {
        return res.redirect("/home");
    }

    res.render("auth/register", {
        title: "Register"
    });
};


// REGISTER USER
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            req.flash("error", "All fields are required.");
            return res.redirect("/auth/register");
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.trim() }
            ]
        });

        if (existingUser) {
            req.flash(
                "error",
                "Username or email already exists."
            );

            return res.redirect("/auth/register");
        }

        if (password.length < 6) {
            req.flash(
                "error",
                "Password must be at least 6 characters."
            );

            return res.redirect("/auth/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        req.session.user = {
            _id: user._id.toString(),
            username: user.username,
            avatar: user.avatar
        };

        req.flash(
            "success",
            "Account created successfully. Welcome to SocialSphere!"
        );

        res.redirect("/home");

    } catch (error) {
        console.error("Register Error:", error);

        req.flash(
            "error",
            "Something went wrong while creating your account."
        );

        res.redirect("/auth/register");
    }
};


// SHOW LOGIN PAGE
exports.getLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect("/home");
    }

    res.render("auth/login", {
        title: "Login"
    });
};


// LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            req.flash(
                "error",
                "Invalid email or password."
            );

            return res.redirect("/auth/login");
        }

        const isPasswordCorrect =
            await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            req.flash(
                "error",
                "Invalid email or password."
            );

            return res.redirect("/auth/login");
        }

        req.session.user = {
            _id: user._id.toString(),
            username: user.username,
            avatar: user.avatar
        };

        req.flash(
            "success",
            `Welcome back, ${user.username}!`
        );

        res.redirect("/home");

    } catch (error) {
        console.error("Login Error:", error);

        req.flash("error", "Login failed.");

        res.redirect("/auth/login");
    }
};


// LOGOUT USER
exports.logoutUser = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout Error:", error);
        }

        res.redirect("/auth/login");
    });
};