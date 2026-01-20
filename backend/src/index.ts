import express from "express";
import cors from "cors"
import { promisify } from 'node:util';
import child_process from 'node:child_process';
import dotenv from "dotenv"
import { prisma } from "./lib/db.js"

dotenv.config()
//@ts-ignore
import Queue from 'bull';
import { Status } from "./generated/prisma/index.js";
import { getPreSignedUrl } from "./lib/s3/index.js";

const exec = promisify(child_process.exec);
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
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

app.use(express.static("C:/js/video-transcoder/transcoder/storage"));

const videoQueue = new Queue('video transcoding', process.env.REDIS_URL!);



app.get("/", async (req, res) => {

  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});



app.post("/getpresignedUrl", async (req, res) => {

  try {

    const { key } = req.body

    if (key.length < 3) {
      return
    }

    const { error, url } = await getPreSignedUrl(key)

    if (error) {
      res.status(500).json({ err: "Internal server error" })
      return
    }


    res.json({ url });
  } catch (error) {
    console.log(error)
    res.status(500).json({ err: "Internal server error" })
  }

})

app.post("/upload-compelete", async (req, res) => {
  try {
    const { key } = req.body



    const video = await prisma.video.create({
      data: {
        key,
        status: Status.UPLOADED
      }
    })

    const data = await videoQueue.add({ key, id: video.id })

    console.log(video)

    res.status(200).json({ message: "video uploaded" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ err: "Internal server error" })
  }
})

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});






