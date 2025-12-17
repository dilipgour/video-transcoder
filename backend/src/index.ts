import express from "express";
import cors from "cors"
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'node:util';
import child_process from 'node:child_process';
import { upload } from "./lib/uploader";
import dotenv from "dotenv"
import {prisma} from "./lib/db"

dotenv.config()
//@ts-ignore
import Queue from 'bull';
import { Status } from "./generated/prisma/index";

const exec = promisify(child_process.exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 3000;
const app = express();



app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
  })
)

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*") // watch it
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept",
    
//   );
//   res.setHeader('Content-Type', 'video/mp4');
//   res.setHeader('Content-Disposition', 'inline');
//   next()
// })
  
app.use(express.static("C:/transcoder/storage"));

const videoQueue = new Queue('video transcoding', 'redis://127.0.0.1:6379');



app.get("/", async(req, res) => {
  
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});



app.post("/upload",upload.single('uploaded_file'),async (req,res)=>{

    if(!req.file){
         res.status(400).json({ error:"file not found" });
         return
    }

      
    try {
      
   const video=  await prisma.video.create({
    data:{
      rawUrl: req.file.destination + "/" + req.file.filename,
      status:Status.UPLOADED
    }
   })


    // console.log(req.file)
    // console.log(video)
const data = await videoQueue.add({fileName:req.file.filename,id:video.id})

console.log(data)
 
const url = `${req.host}/uploads/${req.file.filename}`

res.json({ url });
} catch (error) {
      console.log(error)
      res.status(400).json({err:"Internal server error"})
    }

})

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});








