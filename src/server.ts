import express, { type Application, type Request, type Response } from "express"
import { json } from "node:stream/consumers";
const app: Application = express()
import {Pool} from "pg"
const port = 5000 
app.use(express.json())

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_XEZunMj1wYW8@ep-little-frog-b3bpmp5n.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require"
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
    const {name, email, password, age} = req.body;

    const result = await pool.query(
        `INSERT INTO users(name, email, password, age) VALUES($1,$2, $3, $4) RETURNING *`,
        [name, email, password, age],
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
        const {name, password, age, is_Active} = req.body;
       

        const result = await pool.query(`UPDATE users 
            SET
            name = COALESCE($1, name),
            password = COALESCE($2, password), 
            age = COALESCE($3, age),
            is_Active = COALESCE($4, is_Active),
            updated_at = NOW()
            WHERE id = $5 RETURNING *
             `, [name ?? null , password ?? null, age ?? null, is_Active ?? null, id ])

             console.log(result)

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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})