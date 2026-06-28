import { Router } from "express";
import { getParamsId } from "../utils/middlewares.mjs";
import { products } from "../utils/constants.mjs";

const router = Router();

// GET /api/products
// - Returns all products by default.
// - Supports query filtering with ?filter=product_name&value=text.
router.get("/api/products", (req, res) => {
    const { query: { filter, value } = {} } = req;

    if (filter && value) {
        const q = String(value).toLowerCase();
        const matchedProducts = products.filter((product) => {
            const field = product[filter];
            if (field === undefined || field === null) return false;
            return String(field).toLowerCase().includes(q);
        });

        if (matchedProducts.length === 1) {
            return res.send(matchedProducts[0]);
        }

        return res.send(matchedProducts);
    }

    return res.send(products);
});

// GET /api/products/:id
// - Uses middleware to parse and validate the route id.
// - Returns one product if it exists, otherwise 404.
router.get("/api/products/:id", getParamsId, (req, res) => {
    const id = req.id;
    const product = products.find((product) => product.id === id);
    if (product) {
        return res.send(product);
    }
    return res.status(404).send({ msg: "Product Not Found" });
});

// POST /api/products
// - Create a new product using JSON body data.
// - Requires express.json() middleware in index.mjs.
router.post("/api/products", (req, res) => {
    const body = req.body;
    const newProduct = { id: products[products.length - 1].id + 1, ...body };
    products.push(newProduct);
    return res.status(201).send(newProduct);
});

// PUT /api/products/:id
// - Replace an entire product object at the given id.
// - Responds 400 for invalid id, 404 when the product does not exist.
router.put("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ message: "Bad Request Invalid id" });
    }

    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
        return res.status(404).send({ message: "Product not found" });
    }

    const { body } = req;
    products[productIndex] = { id, ...body };
    return res.status(200).send({ msg: "Product updated" });
});

// PATCH /api/products/:id
// - Update only the fields provided in the request body.
// - Merges new values into the existing product object.
router.patch("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ message: "Bad Request Invalid id" });
    }

    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
        return res.status(404).send({ message: "Product not found" });
    }

    const { body } = req;
    products[productIndex] = { ...products[productIndex], ...body };
    return res.sendStatus(200);
});

// DELETE /api/products/:id
// - Remove a product from the in-memory array.
router.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ message: "Bad Request Invalid id" });
    }

    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
        return res.status(404).send({ message: "Product not found" });
    }

    products.splice(productIndex, 1);
    return res.sendStatus(200);
});

export default router;
