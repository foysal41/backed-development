import fs from "fs"
import path from "path";
import type { iProduct } from "../types/product";


const filePath = path.join(process.cwd(), "./src/database/db.json");

const productService = () => {
    // console.log(filePath)
    const result = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(result);
}

export default productService


export const  createProduct = (payload: iProduct) => {
    fs.writeFileSync(filePath, JSON.stringify(payload))
}