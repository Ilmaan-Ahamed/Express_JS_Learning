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

app.get("/", (req, res)=>{
    res.send({message: "Hello World!"})
});

app.get("/api/users", (req, res)=>{
    res.send(users);
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