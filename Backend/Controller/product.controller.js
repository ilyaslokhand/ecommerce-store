import { redis } from "../lib/redis.js";
import { Product } from "../Models/product.model.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";


const getallProducts = asyncHandler(async(req,res)=>{
   try {
     const products = await Product.find({});
     res.status(200).json(new apiResponse(products,200,"Products fetched successfully"))
   } catch (error) {
    throw new apiError(500, "error fetching products");
   }
})


const getFeaturedProducts = asyncHandler(async(req,res)=>{

    try {
     
        let featuredProducts = await redis.get("featured_products");
        if(featuredProducts){
            featuredProducts = JSON.parse(featuredProducts);
        };
        featuredProducts = await Product.find({isFeatured:true}).lean();
        if(!featuredProducts){
            throw new apiError(404, "No featured products found");
        };

        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.status(200).json(new apiResponse(featuredProducts,200,"Featured products fetched successfully"))
    } catch (error) {
        throw new apiError(500, "error fetching featured products");
    }

})


export { getallProducts,getFeaturedProducts };