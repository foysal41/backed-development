import type { IncomingMessage, ServerResponse } from "http";
import productService, { createProduct } from "../service/product.service";
import type { iProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";
import { platform } from "os";
import { sendResponse } from "../utils/sendResponse";


const  productController = async (req: IncomingMessage, res: ServerResponse) => {

        const url = req.url;
        const method = req.method;
        const urlParams = url?.split("/"); // ['', 'products', '1']
        const id = urlParams && urlParams[1] === "products" ? Number(urlParams[2]):null;
       

        if(url === "/products" && method === "GET") {     
           const products =  productService()

            // res.writeHead(200, { "Content-Type": "application/json" });
            // res.end(
            //   JSON.stringify({ message: "Products retrived successfully!", data: products }),
            // );

            try{
              sendResponse(res, true, 200, "Products retrived successfully", products)
            }catch(error){
              sendResponse(res, false, 500, "Internal Server Error")
            }

        }else if(method === "GET" && id != null) {
          const products =  productService()
          const product = products.find((p: iProduct) => p.id === id);

          if(!product){          
            return sendResponse(res, false, 404, "product Not Found")
          }

          try{
              sendResponse(res, true, 200, "Single product retrived successfully!", product)
            }catch(error){
              sendResponse(res, false, 500, "Internal Server Error")
            }

        }else if(method === "POST" && url === "/products") {
          const body = await bodyParser(req)
          const newProduct = {
            id: Date.now(),
            ...body
          }

          // console.log(newProduct)
          const products =  productService()
          products.push(newProduct);
          createProduct(products)
           

          try{
              sendResponse(res, true, 201, "Product Created Successfully", newProduct)
            }catch(error){
              sendResponse(res, false, 500, "Internal Server Error")
            }


        } else if(method === "PUT" && id !== null) {
          const body = await bodyParser(req)
          const products =  productService()

          const index = products.findIndex((p:iProduct)=> p.id === id);
          // console.log(index)

          if(index < 0) {     
            return   sendResponse(res, false, 404, "Product not found")
          }

          // console.log(products[index])
          products[index] = {id: products[index].id, ...body};
          createProduct(products)

          try{
              sendResponse(res, true, 201, "Product updated Successfully", products[index])
            }catch(error){
              sendResponse(res, false, 500, "Internal Server Error")
            }

        }else if(method === "DELETE" && id !== null) {
          const products = productService();
          const index = products.findIndex((p:iProduct)=> p.id === id);
         
          if(index < 0 ){
            
            return   sendResponse(res, false, 404, "Product not found")

          }

          products.splice(index, 1);
          createProduct(products)
          
          try{
              sendResponse(res, true, 201, "Product Delete Successfully")
            }catch(error){
              sendResponse(res, false, 500, "Internal Server Error")
            }
        }
        
}

export default productController;