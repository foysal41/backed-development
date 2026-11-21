import type { Request, Response } from "express";
import { authService } from "./auth.service";


const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserIntoDB(req.body);
        const {refreshToken} = result
      
        res.cookie("refreshToken", refreshToken, {
            secure: false,          // HTTP (localhost)-এ false, HTTPS (production)-এ true
            httpOnly: true,         // JS দিয়ে টোকেন রিড করা বন্ধ করে (XSS Attack প্রতিরোধ করে)
            sameSite: "lax",        // CSRF Attack প্রতিরোধ করে ('strict' | 'lax' | 'none')
            path: "/",              // কোন রুটে কুকি কাজ করবে
            domain: "localhost",    // প্রোডাকশনে মূল ডোমেইন (যেমন 'example.com')
            // maxAge: 1000 * 60 * 60 * 24 * 10 (অপশনাল: কতক্ষণ কুকি সেভ থাকবে)
        });
        res.status(200).json({
            success: true,
            message: "User Logged in successfully",
            data: result
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || "Authentication failed",
        });
    }
};

export const authController = { 
    loginUser
}