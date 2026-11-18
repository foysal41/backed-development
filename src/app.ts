import express, { type Application, type Request, type Response } from "express"
import pool from "./db"
import { userRoute } from "./modules/users/users.route";

const app: Application = express()

app.use(express.json())


app.get("/", async(req:Request, res: Response) => {
   

    res.status(200).json({
        success: true,
        message : "This is home",
      
    })
    
})


app.use("/api/v1/users" , userRoute)




app.get("/api/v1/users/:id" , async(req:Request, res: Response)=> {

    try{
        const {id} = req.params
        const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
        // console.log(result)

        if(result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!!"
            })
        }
        res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: result.rows[0]
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error,
            error: error
        })
    }
})

//update route
app.put("/api/v1/users/:id" , async(req: Request, res: Response)=> {
    try{

        const {id} = req.params;
        const {name, email, password, age, is_Active} = req.body;
       

        const result = await pool.query(`UPDATE users 
            SET
            name = COALESCE($1, name),
            email = COALESCE($2, email), 
            password = COALESCE($3, password), 
            age = COALESCE($4, age),
            is_Active = COALESCE($5, is_Active),
            updated_at = NOW()
            WHERE id = $6 RETURNING *
             `, [name ?? null, email ?? null , password ?? null, age ?? null, is_Active ?? null, id ])

             console.log(result)

             if(result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!!"
            })
        }

             res.status(200).json({
                success: true,
                message: "User Name Update successfully",
                data: result.rows[0]
             })


    }catch(error) {
        res.status(500).json({
            success: false,
            message: error,
            error: error
        })
    }
})


//Delete route
app.delete("/api/v1/users/:id" , async(req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const result = await pool.query(`DELETE FROM users WHERE id=$1`  , [id]);

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
})





export default app