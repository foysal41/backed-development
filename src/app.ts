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








export default app