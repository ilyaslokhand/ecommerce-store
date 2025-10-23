import { Router } from "express";
import { getallProducts, getFeaturedProducts } from "../Controller/product.controller.js";
import protectedRoute, { adminRoute } from "../Middleware/protectedRoute.js";


const router = Router();

router.get("/allProducts",protectedRoute,adminRoute, getallProducts);
router.get("/featuredProducts", getFeaturedProducts);

export default router;