import colors from "colors";
import cloudinary from "cloudinary";
import app from "./app.js";
import connectDB from "./config/MongoDB.js";
import {
  cloudinaryName,
  port,
  cludinaryApiKey,
  cludinaryApiSecret,
} from "./secret/secret.js";

cloudinary.v2.config({
  cloud_name: cloudinaryName,
  api_key: cludinaryApiKey,
  api_secret: cludinaryApiSecret,
});

app.listen(port, async () => {
  console.log(`server is running on http://localhost:${port}`.bgBlue.bold);
  await connectDB();
});
