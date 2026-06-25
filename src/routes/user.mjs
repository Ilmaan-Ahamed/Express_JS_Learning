import { Router } from "express";

const router = Router();

router.get("/", (req, res)=>{
    res.send({msg: "Root"});
})


export default router;