require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const followRoutes = require("./routes/followRoutes");
const postController = require("./controllers/postController");

const app = express();

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing from the .env file");
    console.error("Please add MONGO_URI=your_mongodb_connection_string to .env");
    process.exit(1);
}

if (!process.env.SESSION_SECRET) {
    console.warn("⚠️ SESSION_SECRET is missing from .env. Using fallback secret.");
}

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    });

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "socialsphere_secret_key_123",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.render("index", {
        title: "Welcome"
    });
});

app.get("/home", postController.getHome);

app.use("/auth", authRoutes);

app.use("/posts", postRoutes);

app.use("/users", userRoutes);

app.use("/follow", followRoutes);

app.use((req, res) => {
    res.status(404).render("index", {
        title: "Page Not Found"
    });
});

app.use((error, req, res, next) => {
    console.error("Server Error:", error);

    res.status(500).send(`
        <h1>500 - Server Error</h1>
        <p>Something went wrong.</p>
        <a href="/home">Go Back Home</a>
    `);
});

app.listen(PORT, () => {
    console.log("=================================");
    console.log("🚀 Server running successfully");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("=================================");
});