import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import { resolve } from "path";


export const createToken = (id : string, email : string, expiresIn) => {
    const payload = {id, email};
    const token = jwt.sign({
        payload
    }, process.env.JWT_SECRET, {
        expiresIn
    })
    return token;
}

export const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if(!token || token.trim() == ""){
        return res.status(411).json({
            message: "Token not recieved"
        })
    }

    return new Promise<void> ((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if(err){
                reject(err.message);
                return res.status(411).json({
                    message: "Token expired"
                })
            }
            else{
                resolve();
                res.locals.jwtData = success.payload;
                
                return next();
                
            }
        });
    });
} 