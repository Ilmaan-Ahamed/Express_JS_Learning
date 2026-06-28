import { Router } from "express";
import  productsRouter  from "../routes/products.mjs";
import  usersRouter  from "../routes/user.mjs";

const router = Router();

// Mount the user and product routers
router.use(usersRouter);
router.use(productsRouter);

export default router;