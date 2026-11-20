import { Router, type NextFunction, type Request, type Response } from "express";
const auth = (req : Request, res: Response, next: NextFunction) => {
   
    // 1-> check if the token exist
    const token = req.headers.authorization;
   if(!token){
    res.status(401).json({
        success: false,
        message: "Unauthorized Access!!"
    })
   }

    next()
}
export default auth;