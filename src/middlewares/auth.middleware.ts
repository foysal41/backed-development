import { type NextFunction, type Request, type Response } from "express";
import  jwt, { type JwtPayload }  from "jsonwebtoken";
import config from "../config";
import pool from "../db";
import type { Role } from "../types";

const auth = (...roles : Role[]) =>  {
    return async(req : Request, res: Response, next: NextFunction) =>{
        try{
            // console.log(roles)

    // 1-> check if the token exists
    const token = req.headers.authorization;
    // console.log(token)
   if(!token){
    return  res.status(401).json({
        success: false,
        message: "Unauthorized Access!!"
    })
   }


   // 2-> Decode 
   const decode = jwt.verify(token as string, config.jwt_secret) as JwtPayload
//    console.log(decode)

   const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [decode.email])

//    check user exist or not
   if(user.rowCount  === 0 ){
    return res.status(404).json({
        success: false,
        message: "User Not Found!!"
    })
   }

//    CHeck if he user active or not
   if(!user.rows[0].is_active){
    return res.status(401).json({
        success: false,
        message: "Forbidden!!"
    })
   }

  

   if(roles.length && !roles.includes(user.rows[0].role)){
    return res.status(401).json({
        success: false,
        message: "Unauthorized Access!! Hint: Go to users.route.ts where add the role inside the auth()"
    })
   }
   
    req.user = decode

    next()
        }catch(error){
            next(error)
        }
    } 
}
export default auth;