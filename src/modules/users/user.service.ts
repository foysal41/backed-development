import pool from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcrypt";




const createUserIntoDB = async (payload: IUser) => {
    // console.log(payload)
    const {name, email, password, age , is_Active, role} = payload;
  

    const hashPassword = await bcrypt.hash(password, 10, )
    console.log(hashPassword)

    const result = await pool.query(
        `INSERT INTO users(name, email, password, age ,is_Active, role) VALUES($1,$2, $3, $4, $5 , COALESCE($6 , 'user')) RETURNING *`,
        [name, email, hashPassword, age, is_Active , role],
    )
    // console.log(result)
    delete result.rows[0].password
    return result;
}

const getAllUsersFromDB = async() => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}

const getSingleUserFromDB = async(id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id=$1` , [id]);
    return result

}


const updateUserFromDB = async(id: string , payload: IUser) => {
    const {name, email, password, age, is_Active, role}  = payload

    const result = await pool.query(`UPDATE users 
            SET
            name = COALESCE($1, name),
            email = COALESCE($2, email), 
            password = COALESCE($3, password), 
            age = COALESCE($4, age),
            is_Active = COALESCE($5, is_Active),
            role=COALESCE($6, role)
            updated_at = NOW()
            WHERE id = $6 RETURNING *
             `, [name ?? null, email ?? null , password ?? null, age ?? null, is_Active ?? null, role?? null, id ])

    return result;
}


const deleteUserFromDB = async(id:string ) => {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`  , [id]);
    return result;
}

export const userService = {
    createUserIntoDB,
    getAllUsersFromDB, 
    getSingleUserFromDB,
    updateUserFromDB,
    deleteUserFromDB
}