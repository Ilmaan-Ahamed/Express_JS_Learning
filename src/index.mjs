import express from "express";
import routes from "./routes/router.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { users } from "../src/utils/constants.mjs";

const app = express(); 
app.use(cookieParser("wiz-001")); // Use cookie-parser middleware with a secret for signed cookies

// Use express-session middleware for session management
app.use(session({
    secret: "wiz-001",          // Secret for signing the session ID cookie
    resave: false,              // Don't save session if unmodified
    saveUninitialized: false,    // Don't create session until something stored
    cookie :{
        maxAge: 60000 * 60,      // Session cookie will expire in 1 hour
        httpOnly: true,          // Mitigate XSS attacks by preventing client-side JS from accessing the cookie
        secure: false            // Set to true if using HTTPS; false for development
    }
}));

app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session());    // Use Passport's session management

    // Here you would typically look up the user in your database and verify the password
    // For demonstration, we will just check against a hardcoded user

passport.use(new LocalStrategy(
    {usernameField: "user_name", passwordField: "password"}, (user_name, password, done) => {
    
    const user = users.find(u => u.user_name === user_name && u.password === password);
    if(!user){
        return done(null, false, { message: "Incorrect username." });
    }
    if(user.password !== password){
        return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
}));

// Serialize the user to store in the session
passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize the user ID to store in the session
});

// Deserialize the user from the session using the stored user ID
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user || false); // Deserialize the user from the session
});

// Parse JSON bodies for all routes
app.use(express.json());

// Mount combined router that already attaches user and product routers
app.use(routes);

const PORT = 3000;

// Root route to verify the server is running
// This route sets a signed cookie for testing purposes and logs session information to the console.
app.get("/", (req, res) => {
    res.cookie("user", "Admin", {maxAge: 60000 * 60, signed: true}); // Set a cookie for testing purposes
   
    req.session.visied = true;  // Example of setting a session variable to track if the user has visited the products route
    console.log(req.session.id)
    
    // Log the session object to see the stored data
    req.sessionStore.get(req.session.id, (err, session) => {
        if (err) {
            console.error("Error retrieving session:", err);
        } else {
            console.log("Retrieved session:", session);
        }
    });
    res.send({ msg: "Root" });
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ message: info.message || "Login failed" });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json({ message: "Login successful", user });
        });
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


