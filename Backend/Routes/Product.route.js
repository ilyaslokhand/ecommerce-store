import { Router } from "express";
import { createProduct, deleteProduct, getallProducts, getFeaturedProducts } from "../Controller/product.controller.js";
import protectedRoute, { adminRoute } from "../Middleware/protectedRoute.js";
import { upload } from "../Middleware/multer.middleware.js";


const router = Router();

router.get("/allProducts",protectedRoute,adminRoute, getallProducts);
router.get("/featuredProducts", getFeaturedProducts);
router.post(
  "/createProduct",
  protectedRoute,            // 👮‍♂️ pehle check kare user logged in hai ya nahi
  adminRoute,                // 👑 phir check kare admin hai ya nahi
  upload.array("image"),    // 📸 ab multer ko bolo ke "images" field se multiple files aayengi
  createProduct              // 💼 finally controller chalega
);
router.delete("/:id", protectedRoute, adminRoute, deleteProduct)

export default router;