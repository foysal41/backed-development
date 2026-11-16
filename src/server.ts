import express, { type Application, type Request, type Response } from "express"
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
            CREATE TABLE users (
            id SERIAL PRIMARY KEY ,
            name VARCHAR(255),
            email VARCHAR(255) NOT NULL,
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



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})