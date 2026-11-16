import express, { type Application, type Request, type Response } from "express"
const app: Application = express()
import {Pool} from "pg"
const port = 5000 
app.use(express.json())

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_XEZunMj1wYW8@ep-little-frog-b3bpmp5n.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})
console.log(pool)


app.get("/", async(req:Request, res: Response) => {
   

    res.status(200).json({
        success: true,
        message : "This is home",
      
    })
    
})

// app.post("/", async(req:Request, res: Response) => {
//     // console.log(req.body)
//     const {name, age, pass} = req.body;

//     res.status(200).json({
//         success: true,
//         message : "This is a test api!",
//         data: {name, age}
//     })
    
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})