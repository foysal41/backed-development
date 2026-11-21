import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (error:any, req: Request, res: Response, next: NextFunction) => {
    console.log(error.stack); //? log the error
    res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error. HINT: src>middlewares | globalErrorHandler.ts"
    })
}

export default globalErrorHandler