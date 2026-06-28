import express from "express";
import routes from "./routes/router.mjs";

const app = express();

// Parse JSON bodies for all routes
app.use(express.json());

// Mount combined router that already attaches user and product routers
app.use(routes);

const PORT = 3000;

// Root route to verify the server is running
app.get("/", (req, res) => {
    res.send({ msg: "Root" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


