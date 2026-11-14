import type { IncomingMessage, ServerResponse } from "http";
import productService from "../service/product.service";
import type { iProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";


const  productController = async (req: IncomingMessage, res: ServerResponse) => {

        const url = req.url;
        const method = req.method;
        const urlParams = url?.split("/"); // ['', 'products', '1']
        const id = urlParams && urlParams[1] === "products" ? Number(urlParams[2]):null;
       

        if(url === "/products" && method === "GET") {     
           const products =  productService()

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Products retrived successfully!", data: products }),
            );
        }else if(method === "GET" && id != null) {
          const products =  productService()
          const product = products.find((p: iProduct) => p.id === id);

          res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Single product retrived successfully!", data: product }),
            );

        }else if(method === "POST" && url === "/products") {
          const body = await bodyParser(req)
          console.log(body)
        }
        
}

export default productController;