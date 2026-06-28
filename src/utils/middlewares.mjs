import { users } from "./constants.mjs";

export const getUserIndexById = (req, res, next) => {
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

export const getParamsId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({message: "Bad Request Invalid id"})
    }
    req.id = id;
    next();
}