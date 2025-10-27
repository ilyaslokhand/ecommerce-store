import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: "./.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const UploadOnCloudinary = async (ImageLocalPath)=>{

     if (!ImageLocalPath) return null;

    try {
        const result = await cloudinary.uploader.upload(ImageLocalPath,{
            resource_type: "auto",
            folder: 'products',
        });

        fs.unlinkSync(ImageLocalPath);
        return result.secure_url;
        
    } catch (error) {
         fs.unlink(localFilePath);
        console.log("file upload failed", error);
        return null;
    }
}

export default UploadOnCloudinary;