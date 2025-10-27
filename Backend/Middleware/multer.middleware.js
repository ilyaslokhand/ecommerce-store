import multer from 'multer';
import path from 'path';
import fs from 'fs';


const uploadDir = path.join(process.cwd(), 'Public', 'temp'); // 📁 Matlab ek temporary folder ban gaya jahan sab images pehle save hongi.

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true })  // Waise hi hum check kar rahe hain: “Public/temp” folder hai ya nahi. Agar nahi — bana do 😄
};

const storage = multer.diskStorage({
  destination(req, file, cb) {  // destination: bata raha hai photo kis folder mein jayegi.
    cb(null, uploadDir); 
  },
  filename(req, file, cb) {  // filename: photo ka naam kya hoga.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);   // Hum random number + time lagake unique naam banate hain, // taaki agar 2 log ek hi naam wali photo bhejein (e.g., image.png), // to server confuse na ho jaaye 😅
    const name = uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, name);
  },

});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Agar koi bohot badi photo bhejta hai (5MB se zyada) → ❌ error aayega.
  fileFilter(req, file, cb) { // “Sirf image hi upload ho, koi .exe ya .pdf nahi!”
    const allowed = ['.png', '.jpg', '.jpeg', '.webp'];             // Yani agar koi .png ya .jpg bhejta hai → ✅
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
});



// To flow aise chalega 👇
// 📤 User photo bhejta hai →
// 📥 Multer photo ko “Public/temp” mein rakh deta hai →
// 🧠 Controller (createProduct) Cloudinary pe upload karta hai →
// 🧹 Server temp file delete kar deta hai →
// ✅ Done!


// | Kaam              | Matlab                                  |
// | ----------------- | --------------------------------------- |
// | `multer`          | File upload karne ka helper             |
// | `uploadDir`       | Jahan files temporarily store hoti hain |
// | `fs.mkdirSync`    | Agar folder nahi hai to bana deta hai   |
// | `filename`        | Har photo ka unique naam banata hai     |
// | `fileFilter`      | Sirf images allow karta hai             |
// | `limits.fileSize` | 5MB se badi file reject karta hai       |
// | `upload`          | Ye middleware routes mein use hota hai  |
