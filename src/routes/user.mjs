import { Router } from "express";

const router = Router();

// router.get("/", (req, res)=>{
//     res.send({msg: "Root"});
// })

const users = [
    {id:1, user_name: "Thor"},
    {id:2, user_name: "Spider Man"},
    {id:3, user_name: "Hulk"},
    {id:4, user_name: "Captain America"},
    {id:5, user_name: "Iron Man"},
]

router.get("/api/user/:id", (req, res)=>{
    const{query:{filter, value}} =req;
    if(filter && value){
        return res.send(users.filter(((user) => user[filter].toLowerCase)))
    }
}

export default router;