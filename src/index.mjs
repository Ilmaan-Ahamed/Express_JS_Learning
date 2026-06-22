import express from "express";

const app = express();

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
app.get("/", (req, res)=>{
    res.send({message: "Hello World!"})
});

app.get("/api/users", (req, res)=>{
    res.send(users);
});

app.get("/api/products", (req, res)=>{
    res.send(products);
});


app.get("/api/users/:id", (req, res)=>{

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
// app.get("/api/users", (req, res)=>{
//     const{query:{filter, value}} = req;
//     console.log(filter, value);

//     // If no filter/value provided, return all users
//     if (!filter || !value) {
//         return res.send(users);
//     }

//     const q = String(user).toLowerCase();
//     const results = users.filter((user) => {
//         const field = user[filter];
//         if (field === value || field === null) return false;
//         return String(field).toLowerCase().includes(q);
//     });

//     return res.send(results);
// });


// // localhost:3000/products?filter=product_name&value=Th
// // Use `/api/products` for query filtering. Keep `/api/products/:id` separate
// // if you want to fetch by id.
// app.get("/api/products", (req, res) => {
//     const { query: { filter, value } = {} } = req;
//     console.log(filter, value);

//     // If no filter/value provided, return all products
//     if (!filter || !value) {
//         return res.send(products);
//     }

//     const q = String(value).toLowerCase();
//     const results = products.filter((product) => {
//         const field = product[filter];
//         if (field === value || field === null) return false;
//         return String(field).toLowerCase().includes(q);
//     });

//     return res.send(results);
// });

// Post Request Api

// Parse incoming JSON payloads and populate `req.body`.
// This middleware is required before handlers that read `req.body`.
app.use(express.json()); // Middlewares 

// Create a new user
app.post("/api/users", (req, res)=>{
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