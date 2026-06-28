import { Router } from "express";
import { getParamsId } from "../utils/middlewares.mjs";
import { users } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";

const router = Router();

// GET /api/user
// - Returns all users by default
// - Supports query filtering with ?filter=user_name&value=text
router.get("/api/user", (req, res) => {
    const { query: { filter, value } = {} } = req;

    if (filter && value) {
        const q = String(value).toLowerCase();
        const matchedUsers = users.filter((user) => {
            const field = user[filter];
            if (field === undefined || field === null) return false;
            return String(field).toLowerCase().includes(q);
        });

        if (matchedUsers.length === 1) {
            return res.send(matchedUsers[0]);
        }

        return res.send(matchedUsers);
    }

    return res.send(users);
});

// GET /api/user/:id
// - Uses middleware to parse/validate `:id` and attach it to `req.id`
// - Returns the user if found, otherwise 404
router.get("/api/user/:id", getParamsId, (req, res) => {
    const id = req.id;
    const user = users.find((u) => u.id === id);
    if (user) {
        return res.send(user);
    }
    return res.status(404).send({ msg: "User Not Found" });
});

// POST /api/user
// - Create a new user using a validation schema from `validationSchemas.mjs`
// - The `checkSchema` middleware sanitizes/parses fields; use `matchedData` to get the parsed body
router.post(
    "/api/user",
    checkSchema(createUserValidationSchema),
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() });
        }

        // Show express-validator contexts for debugging (optional)
        console.log(req["express-validator#contexts"]);

        // Use matchedData to get only validated/sanitized fields
        const body = matchedData(req);

        const newUser = { id: users[users.length - 1].id + 1, ...body };
        users.push(newUser);
        return res.status(201).send(newUser);
    }
);

// PUT /api/user/:id
// - Full replace of a user object (expects entire user payload)
router.put("/api/user/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ message: "Bad Request Invalid id" });
    }

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    const { body } = req;
    users[userIndex] = { id, ...body };
    return res.status(200).send({ msg: "User updated" });
});

// PATCH /api/user/:id
// - Partial update: merges provided fields into existing user
router.patch("/api/user/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ message: "Bad Request Invalid id" });
    }

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    const { body } = req;
    users[userIndex] = { ...users[userIndex], ...body };
    return res.sendStatus(200);
});

// DELETE /api/user/:id
// - Remove a user from the in-memory store
router.delete("/api/user/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ message: "Bad Request Invalid id" });
    }

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    users.splice(userIndex, 1);
    return res.sendStatus(200);
});

export default router;