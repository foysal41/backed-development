import type { IncomingMessage, ServerResponse } from "http";
import productService from "../service/product.service";
import type { iProduct } from "../types/product";


const productController = (req: IncomingMessage, res: ServerResponse) => {

        const url = req.url;
        const method = req.method;

        if(url === "/products" && method === "GET") {     
           const products =  productService()

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Products retrived successfully!", data: products }),
            );
        }
        
}

export default productController;