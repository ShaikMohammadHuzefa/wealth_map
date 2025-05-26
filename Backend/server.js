if(process.env.NODE_ENV != "production"){ //present we are in dev pase
    require('dotenv').config()
}

const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const app = express();

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON

const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("connected to DB");
}) .catch(err => {
    console.log(err);
});
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {  // prefered to use for encryption
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next) => {
    res.locals.currUser = req.user;
    next();
});

/* const saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}; */
// Enable CORS
app.use(cors({
    origin: 'https://wealth-map-frontend.onrender.com', // Allow only your frontend
    credentials: true // Enable cookies and authentication headers
}));

app.options('*', cors()); // Allow preflight requests globally
// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Wealth Map API!');
});

app.post("/signup", async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.json({ success: true, message: "Signup successful", user: registeredUser });
        });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
});

// **Updated Login Route**
app.post("/login", passport.authenticate("local", { failureMessage: true }), (req, res) => {
    res.json({ success: true, redirectUrl: "/home", user: req.user });
});

// **Updated Logout Route**
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err); 
        req.session.destroy(() => {
            res.json({ success: true, message: "Logged out successfully" });
        });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
