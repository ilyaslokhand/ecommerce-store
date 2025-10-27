import { redis } from "../lib/redis.js";
import { Product } from "../Models/product.model.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import UploadOnCloudinary from "../lib/cloudinary.js";
import apiError from "../Utils/apiError.js";
import { v2 as cloudinary } from 'cloudinary';
import getCloudinaryPublicId from "../Utils/getCloudinaryPublicId.js";



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

const createProduct = asyncHandler(async(req,res)=>{
    const {name, description, price, catagory} = req.body;

   if (!name || !price) {
    throw new apiError(400, 'Name and price are required');
  };

  const numericPrice = Number(String(price).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numericPrice)) {
    throw new apiError(400, 'Price must be a number');
  }

  let files = [];

  if(Array.isArray(req.files)) files = req.files; // Multiple files
  else if(req.file) files.push(req.file); // single file

  if(files.length===0){
    throw new apiError(400, "At least one image is required");
  };

  const uploadPromises = files.map(file=> UploadOnCloudinary(file.path)); // Array of promises
  const cloudinaryImageUrl = await Promise.all(uploadPromises); // Array of uploaded image URLs

    const productData = {
    name,
    description: description || '',
    price: numericPrice,
    catagory: catagory || null,
    image: cloudinaryImageUrl[0], // array (could be empty)
  };

  const newProduct = await Product.create(productData);

    res.status(200).json(new apiResponse(newProduct,200,"Product created successfully"))
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    
    if(!product){
        throw new apiError(404, "Product not found");
    };

    if(product.image){
        await cloudinary.uploader.destroy(getCloudinaryPublicId(product.image));
    }
    await Product.findByIdAndDelete(id);

    res.status(200).json(new apiResponse("",200,"Product deleted successfully"))

})


export { getallProducts,getFeaturedProducts,createProduct,deleteProduct };