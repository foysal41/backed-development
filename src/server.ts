import express, { type Application, type Request, type Response } from "express"
import { json } from "node:stream/consumers";
const app: Application = express()
import {Pool} from "pg"
import config from "./config";
app.use(express.json())

const pool = new Pool({
    connectionString: config.connection_string
})

const initDB = async () => {
    try{

        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY ,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            age INT,
            is_Active BOOLEAN DEFAULT true,
            crated_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            );          

            `
        )
        console.log("Database connected")
    }catch(error) {
        console.log(error)
    }
}
initDB()

app.get("/", async(req:Request, res: Response) => {
   

    res.status(200).json({
        success: true,
        message : "This is home",
      
    })
    
})


app.post("/api/v1/users" , async(req:Request, res: Response) => {
    try{
        console.log(req.body)
    const {name, email, password, age , is_Active} = req.body;

    const result = await pool.query(
        `INSERT INTO users(name, email, password, age ,is_Active) VALUES($1,$2, $3, $4, $5) RETURNING *`,
        [name, email, password, age, is_Active],
    )
    console.log(result)

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
})


app.get("/api/v1/users" , async(req:Request, res: Response) => {
    try{

        const result = await pool.query(`SELECT * FROM users`)

        res.status(200).json({
            success: true,
            message: "Users Retrived Successfully",
            data: result.rows
        })

    }catch(error: any){
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error
        })
    }
})

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


app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})