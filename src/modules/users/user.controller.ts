import type { Request, Response } from "express";
import pool from "../../db";
import { userService } from "./user.service";

const createUser = async(req:Request, res: Response) => {
     try{
        const result  = await userService.createUserIntoDB(req.body)

    res.status(201).json({
        success: true,
        message: "This is post request",
        data: result.rows[0]
    })
    }catch(error : any) {
         res.status(500).json({
        success: false,
        message: error.message,
        error: error
        
    })
    }
}


const getAllUsers = async(req: Request, res: Response) => {

    try{
        const result = await userService.getAllUsersFromDB();

        res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: result.rows
        })

    }catch(error : any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}


const getSingleUser = async (req: Request, res: Response) => {
    try{

        const {id} = req.params;
        const result = await userService.getSingleUserFromDB(id as string)

        if(result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User Retrived Successfully",
            data: result.rows[0]
        })

    }catch(error: any) {
        res.status(404).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

const updateUser = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;

        const result = await userService.updateUserFromDB(id as string, req.body )

        if(result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User Update Successfull",
            data: result.rows[0]
            
        })

    }catch(error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error : error
        })
    }
}


const deleteUser = async(req: Request, res: Response) => {
     try{
        const {id} = req.params;
        const result = await userService.deleteUserFromDB(id as string)

        if(result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!!"
            })
        }
         res.status(200).json({
                success: true,
                message: "User Delete successfully",             
            })
    }catch(error){
         res.status(500).json({
            success: false,
            message: error,
            error: error
        })
    }
}




export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}