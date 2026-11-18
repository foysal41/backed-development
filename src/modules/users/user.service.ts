import pool from "../../db";
import type { IUser } from "./user.interface";




const createUserIntoDB = async (payload: IUser) => {
    console.log(payload)
    const {name, email, password, age , is_Active} = payload;

    const result = await pool.query(
        `INSERT INTO users(name, email, password, age ,is_Active) VALUES($1,$2, $3, $4, $5) RETURNING *`,
        [name, email, password, age, is_Active],
    )
    console.log(result)
    return result;
}

const getAllUsersFromDB = async() => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}

export const userService = {
    createUserIntoDB,
    getAllUsersFromDB, 
}