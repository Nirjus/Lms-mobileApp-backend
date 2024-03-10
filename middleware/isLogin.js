import jwt from "jsonwebtoken";
import { jwtSecret } from "../secret/secret.js";

export const isLogin = async (req, res, next) => {

    try {
        const {token} = req.cookies;

        if(!token){
             throw Error("User not found, Please Login");
        }
       const decodedUser = jwt.verify(token, jwtSecret);
       if(!decodedUser){
           return res.status(400).json({
            success: false,
            message: "Session expired, Login again"
           })
       }
     
       req.userId = decodedUser.id;

       return next();

    } catch (error) {
        next(error)
    }
}