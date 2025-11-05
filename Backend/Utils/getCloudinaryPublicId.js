function getCloudinaryPublicId(ImageUrl){
  try {
    const parts = ImageUrl.split('/');
    const uploadIndex = parts.findIndex(p => p === 'upload');
    const publicPath = parts.slice(uploadIndex + 2).join('/');
   const publicId = publicPath.split('.')[0];
    return publicId
  } catch (error) {
    return null;
  }
}

export default getCloudinaryPublicId;



//     const parts = ImageUrl.split('/');
//     👉 Yeh line image URL ko '/' ke basis pe tod deti hai —
// matlab ek URL list ban jaata hai.

// Example: ["https:", "", "res.cloudinary.com", "mycloud", "image", "upload", "v123", "products", "photo123.png"]


// const uploadIndex = parts.findIndex(p => p === 'upload');
// 👉 Yeh line dekhti hai ki "upload" kis jagah (index number) par hai list me.
// Kyun?
// Kyuki Cloudinary me "upload" ke baad hi folder aur file name aata hai.

// Example me "upload" 5th index pe tha.

// const publicPath = parts.slice(uploadIndex + 1).join('/');
// 👉 Yeh line "upload" ke baad ka sab part le leti hai (slice karta hai).
// To hume milta hai:

// css
// Copy code
// ["v123", "products", "photo123.png"]
// Aur join('/') se firse string ban jaati hai:

// arduino
// Copy code
// "v123/products/photo123.png"

// const publicId = publicPath.split('.')[0];
// 👉 Yeh line .png ya .jpg jaise file extension hata deti hai.
// To bacha hua part hota hai: