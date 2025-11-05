import { Router } from "express";
import { createProduct, deleteProduct, getallProducts, getFeaturedProducts, getproductbyCatagory, getrecommendedProducts, togglefeaturedProduct } from "../Controller/product.controller.js";
import protectedRoute, { adminRoute } from "../Middleware/protectedRoute.js";
import { upload } from "../Middleware/multer.middleware.js";


const router = Router();

router.get("/allProducts",protectedRoute,adminRoute, getallProducts);
router.get("/featuredProducts", getFeaturedProducts);
router.get("/recommendedProducts",getrecommendedProducts);
router.get("/catagory/:catagory", getproductbyCatagory);
router.post(
  "/createProduct",
  protectedRoute,            // 👮‍♂️ pehle check kare user logged in hai ya nahi
  adminRoute,                // 👑 phir check kare admin hai ya nahi
  upload.array("image"),    // 📸 ab multer ko bolo ke "images" field se multiple files aayengi
  createProduct              // 💼 finally controller chalega
);
router.patch("/:id", protectedRoute,adminRoute,togglefeaturedProduct)
router.delete("/:id", protectedRoute, adminRoute, deleteProduct)


export default router;