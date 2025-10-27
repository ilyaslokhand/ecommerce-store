import { Router } from "express";
import { createProduct, getallProducts, getFeaturedProducts } from "../Controller/product.controller.js";
import protectedRoute, { adminRoute } from "../Middleware/protectedRoute.js";


const router = Router();

router.get("/allProducts",protectedRoute,adminRoute, getallProducts);
router.get("/featuredProducts", getFeaturedProducts);
router.post("/createProduct",protectedRoute,adminRoute, createProduct);

export default router;