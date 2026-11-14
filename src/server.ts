import {createServer, IncomingMessage, Server, ServerResponse} from "http";
import { json } from "stream/consumers";
import routeHandler from "./routes/route";

const server: Server = createServer((req: IncomingMessage, res : ServerResponse) => {
    // console.log(req.url)
    // console.log(req.method)

    routeHandler(req, res)
    
})

server.listen(5000, ()=>{
    console.log("Server is running!")
})