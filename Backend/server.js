import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./DB/index.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error in app:", error);
    });

    app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


  })
  .catch((err) => {
    console.error("Error in connecting to DB:", err);
  });
