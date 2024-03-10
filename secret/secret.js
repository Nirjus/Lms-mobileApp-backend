import dotenv from "dotenv";

dotenv.config({
    path:"./secret/.env"
})

export const port = process.env.PORT || 8001;

export const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ELearner";

export const jwtSecret = process.env.JWT_SECRET;

export const defaultAvatar = "./assets/images/pngegg.png";