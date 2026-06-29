import express from "express";
import routes from "./routes/router.mjs";
import cookieParser from "cookie-parser";

const app = express(); 
app.use(cookieParser("wiz-001")); // Use cookie-parser middleware with a secret for signed cookies

// Parse JSON bodies for all routes
app.use(express.json());

// Mount combined router that already attaches user and product routers
app.use(routes);

const PORT = 3000;

// Root route to verify the server is running
app.get("/", (req, res) => {
    res.cookie("user", "Admin", {maxAge: 60000 * 60, signed: true}); // Set a cookie for testing purposes
    res.send({ msg: "Root" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


