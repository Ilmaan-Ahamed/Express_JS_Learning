import express from "express";
import routes from "./routes/router.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


