import jwt, { type JwtPayload } from "jsonwebtoken";
import pool from "../../db";
import type { IAuth } from "./auth.interface";
import bcrypt from 'bcrypt';
import config from "../../config";



const loginUserIntoDB = async (payload : IAuth) => {
   
    // Check if the user exist
    // check if the password match
    // check user status
    // if pass all generate the token 
    const {email, password} = payload;
    const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

    // console.log(user.rows[0])

    if(user.rowCount === 0) {
        throw new Error ("Invalid Credential")
    }

   
    const matchPassword = await bcrypt.compare(password, user.rows[0].password);

    if(!matchPassword) {
        throw new Error ("Invalid Credential")
    }

    if(!user.rows[0].is_active) {
        throw new Error ("Access Denied!")
    }

    const jwtPayLoad = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
    }
    

    const accessToken = jwt.sign(jwtPayLoad , config.jwt_secret, {expiresIn: "1h"})

     const refreshToken = jwt.sign(jwtPayLoad , config.refresh_secret, {expiresIn: "10d"})

  
    return {accessToken, refreshToken }
}

const generateAccessToken = async(token:string) => {
    if(!token){
   throw new Error("Unauthorized Access!")
   }


   // 2-> Decode 
   const decode = jwt.verify(token as string, config.refresh_secret) as JwtPayload
//    console.log(decode)

   const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [decode.email])

//    check user exist or not
   if(user.rowCount  === 0 ){
    throw new Error("User Not Found!!")
   }

 //    CHeck if he user active or not
   if(!user.rows[0].is_active){
    throw new Error("Forbidden!!")
   }

       const jwtPayLoad = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
    }
    

    const accessToken = jwt.sign(jwtPayLoad , config.jwt_secret, {expiresIn: "1h"})

        return {accessToken}
}



export const authService =  {
    loginUserIntoDB,
    generateAccessToken
}

