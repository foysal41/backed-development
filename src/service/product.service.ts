import fs from "fs"
import path from "path";


const filePath = path.join(process.cwd(), "./src/database/db.json");

const productService = () => {
    // console.log(filePath)
    const result = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(result);
}

export default productService