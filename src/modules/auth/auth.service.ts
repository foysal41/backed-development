import jwt from "jsonwebtoken";
import pool from "../../db";
import type { IAuth } from "./auth.interface";
import bcrypt from 'bcrypt';


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
        email: user.rows[0].email
    }

    const accessToken = jwt.sign(jwtPayLoad , 'asdf;lkj', {expiresIn: "1d"})
   

  
    return accessToken
}



export const authService =  {
    loginUserIntoDB
}

