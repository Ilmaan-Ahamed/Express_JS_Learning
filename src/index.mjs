import express from "express";

// for Validation 
import {createUserValidationSchema} from './utils/validationSchemas.mjs'
import { validationResult, matchedData, checkSchema } from "express-validator";

import userRouter from "./routes/user.mjs"

const app = express();
app.use(express.json());
app.use(userRouter);

const PORT = 3000;

const users = [
    {id:1, user_name: "Thor"},
    {id:2, user_name: "Spider Man"},
    {id:3, user_name: "Hulk"},
    {id:4, user_name: "Captain America"},
    {id:5, user_name: "Iron Man"},
]

const products = [
    {id:1, product_name: "Mjolnir"},
    {id:2, product_name: "Web Shooters"},
    {id:3, product_name: "Hulk's Gamma Ray"},
    {id:4, product_name: "Shield"},
    {id:5, product_name: "Arc Reactor"},
]


            // Route Parameter
// Post Request Api
// app.get("/", (req, res)=>{
//     res.send({message: "Hello World!"})
// });

// Get Request Api
app.get("/api/user", (req, res)=>{
    res.send(users);
});

// Get Request Api
app.get("/api/products", (req, res)=>{
    res.send(products);
});

// Get Request Api
app.get("/api/user/:id", (req, res)=>{

    // to conver Sting to int parseInt() usefull
    const id = parseInt(req.params.id);
    if(isNaN(id)){
       return res.status(400).send({message: "Bad Request Invaild id"})
    }

    const user = users.find((user) => user.id === id);
    if(user){
        return res.send(user);
    }
    return res.status(404).send({message: "User not found"});
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})


 //Qurey prameters

// //localhost:3000/users?filter=user_name&value=Th
app.get("/api/user", (req, res)=>{
    const{query:{filter, value}} = req;
    console.log(filter, value);

    // If no filter/value provided, return all users
    if (!filter || !value) {
        return res.send(users);
    }

    const q = String(user).toLowerCase();
    const results = users.filter((user) => {
        const field = user[filter];
        if (field === value || field === null) return false;
        return String(field).toLowerCase().includes(q);
    });

    return res.send(results);
});


// // localhost:3000/products?filter=product_name&value=Th
// Use `/api/products` for query filtering. Keep `/api/products/:id` separate
// if you want to fetch by id.

app.get("/api/products", (req, res) => {
    const { query: { filter, value } = {} } = req;
    console.log(filter, value);

    // If no filter/value provided, return all products
    if (!filter || !value) {
        return res.send(products);
    }

    const q = String(value).toLowerCase();
    const results = products.filter((product) => {
        const field = product[filter];
        if (field === value || field === null) return false;
        return String(field).toLowerCase().includes(q);
    });

    return res.send(results);
});

// Post Request Api

// Parse incoming JSON payloads and populate `req.body`.
// This middleware is required before handlers that read `req.body`.

// app.use(express.json()); // Middlewares 

// Create a new user
app.post("/api/user", (req, res)=>{
    // Log the incoming request body for debugging / inspection
    console.log(req.body);

    // Destructure the parsed body from the request object
    const {body} =req;

    // Create a new user object. The id is auto-incremented using
    // the last user's id in the in-memory `users` array.
    const newUser = {id: users[users.length-1].id+1, ...body};

    // Add the new user to the in-memory store
    users.push(newUser);

    // Return 201 Created with the new resource in the response body
    return res.status(201).send(newUser);
})

// Put - Update Request API (complete replacement)

// - Parses `:id` from the URL and validates it
// - Finds the user by index and replaces the whole user object
// - Expects a JSON body (middleware `express.json()` is enabled)
// - Returns 400 for invalid id, 404 if user missing, 200 on success

app.put("/api/user/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({message: "Bad Request Invalid id"})
    }
    const userIndex = users.findIndex((user) => user.id === id);
    if(userIndex === -1){
        return res.status(404).send({message: "User not found"});
    }
    const {body} = req;
    users[userIndex] = {id: id, ...body};
    return res.status(200).send({msg: "user updated"});

})

// Patch Request API (partial update)

// - Similar to PUT but merges provided fields into the existing user
// - Validates `:id` and existence of the user
// - Returns 400 for invalid id, 404 if user missing, 200 on success

app.patch("/api/user/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({message: "Bad Request Invalid id"})
    }
    const userIndex = users.findIndex((user) => user.id === id);
    if(userIndex === -1){
        return res.status(404).send({message: "User not found"});
    }
    const {body} = req;
    users[userIndex] ={...users[userIndex], ...body}
    return res.sendStatus(200);
})

// Delete Request API

// - Validates `:id`, finds the user index and removes the user from the array
// - Returns 400 for invalid id, 404 if user missing, 200 on success

app.delete("/api/user/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({message: "Bad Request Invalid id"})
    }
    const userIndex = users.findIndex((user) => user.id === id);
    if(userIndex === -1){
        return res.status(404).send({message: "User not found"});
    }
    users.splice(userIndex, 1);
    res.sendStatus(200);
})

// Middlewares II

// Middlewares For getUserIndexByID
const getUserIndexById = (req, res, next) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({message: "Bad Request Invalid id"})
    }
    const userIndex = users.findIndex((user) => user.id === id);
    if(userIndex === -1){
        return res.status(404).send({message: "User not found"});
    }
    req.userIndex = userIndex;
    next();
}

// use Delete Request with Middleware II getUserIndexById

app.delete("/api/user/:id",getUserIndexById, (req,res)=>{
    const userIndex = req.userIndex;
    console.log(userIndex)
    users.splice(userIndex, 1);
    res.sendStatus(200);
})

// Use Patch Request with Middleware II 
app.patch("/api/user/:id", (req,res)=>{
    const userIndex = req.userIndex;
    const {body} = req;
    users[userIndex] ={...users[userIndex], ...body}
    return res.sendStatus(200);
})

// Use Put Request with Middleware II 
app.put("/api/user/:id", (req,res)=>{
    const userIndex = req.userIndex;
    const {body} = req;
    users[userIndex] ={...users[userIndex], ...body}
    return res.sendStatus(200);
})

// use Delete Request with Middleware II getUserIndexById

app.delete("/api/user/:id",getUserIndexById, (req,res)=>{
    const userIndex = req.userIndex;
    console.log(userIndex)
    users.splice(userIndex, 1);
    res.sendStatus(200);
})

// Use Patch Request with Middleware II 
app.patch("/api/user/:id", (req,res)=>{
    const userIndex = req.userIndex;
    const {body} = req;
    users[userIndex] ={...users[userIndex], ...body}
    return res.sendStatus(200);
})


// Middlewares For getParamsId user id & product id
const getParamsId = (req, res, next)=>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
       return res.status(400).send({message: "Bad Request Invaild id"})
    }
    req.id = id;
    next();
}

// Use Middleware II for getParamsId user id & product id
// Use Put Request with Middleware II 

app.get("/api/user/:id",getParamsId, (req,res)=>{
    const id = req.id;
    const user = users.find((user)=>user.id === id);
    if(user){
        return res.send(user);
    }
    return res.status(404).send({msg: "User Not Found"});
});

// Use Middleware II for getParamsId user id & product id
app.get("/api/products/:id",getParamsId, (req,res)=>{
    const id = req.id;
    const user = users.find((user)=>user.id === id);
    if(user){
        return res.send(user);
    }
    return res.status(404).send({msg: "User Not Found"});
});


// Create a new user With Validation Schema
app.post("/api/user", checkSchema(createUserValidationSchema), (req, res)=>{

    //Get the validation result from the request object
    const result = validationResult(req);
    
    // If there are validation errors, return 400 Bad Request with the error details
    if(!result.isEmpty()){
        return res.status(400).send({error:result.array()});
    }

    // Log the incoming request body for debugging / inspection with Validation Schema
    console.log(req['express-validator#contexts']);

    // Destructure the parsed body from the request object
    const body = matchedData(req);

    // Create a new user object. The id is auto-incremented using
    // the last user's id in the in-memory `users` array.
    const newUser = {id: users[users.length-1].id+1, ...body};

    // Add the new user to the in-memory store
    users.push(newUser);

    // Return 201 Created with the new resource in the response body
    return res.status(201).send(newUser);
})
