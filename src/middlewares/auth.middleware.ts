import { Router, type NextFunction, type Request, type Response } from "express";
import  jwt, { type JwtPayload }  from "jsonwebtoken";
import config from "../config";
import pool from "../db";
const auth = async(req : Request, res: Response, next: NextFunction) => {
    

    // 1-> check if the token exist
    const token = req.headers.authorization;
    // console.log(token)
   if(!token){
    res.status(401).json({
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
    res.status(404).json({
        success: false,
        message: "User Not Found!!"
    })
   }

//    CHeck if he user active or not
   if(!user.rows[0].is_active){
    res.status(401).json({
        success: false,
        message: "Forbidden!!"
    })
   }

   req.user = decode
   

    next()
}
export default auth;