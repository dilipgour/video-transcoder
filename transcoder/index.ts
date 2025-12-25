import Queue from "bull"
import {prisma} from "./lib/db"
import { runFFmpeg } from "./lib/ffmpeg";
import dotenv from "dotenv"

dotenv.config()

const videoQueue = new Queue('video transcoding', process.env.REDIS_URL!);
const fn  = async()=>{
    console.log("worker...................")
    videoQueue.process( async (job,done)=>{
console.log(job.data)

await prisma.video.update({
    where:{id:job.data.id},
    data:{status:"PROCESSING"}
})



try {
  await runFFmpeg(job.data.fileName, `${job.data.fileName.split(".")[0]}.m3u8`);
  await prisma.video.update({
    where:{id:job.data.id},
    data:{
        status:"SUCCESS",
        url:`/transcoded/${job.data.fileName.split(".")[0]}/master.m3u8`

    }
})
  console.log("Transcoding complete ✅");
} catch (err:any) {
    
  console.error("Critical failure ❌", err.message);
  await prisma.video.update({
    where:{id:job.data.id},
    data:{status:"FAILED"}
})
}


done()
    })

}

fn()