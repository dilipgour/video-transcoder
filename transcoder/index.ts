import Queue from "bull"
import {prisma} from "./lib/db"
import { runFFmpeg } from "./lib/ffmpeg";
import dotenv from "dotenv"
import { videoDownloader } from "./lib/video-downloader";

dotenv.config()

const videoQueue = new Queue("video transcoding", process.env.REDIS_URL!, {
  defaultJobOptions: {
    timeout: 5 * 60 * 1000 // 5 minutes
  }
});

videoQueue.process(async (job) => {
  try {
    console.log("worker...................");
    console.log(job.data);
  
    console.log("downloading................");
  
    const filePath = await videoDownloader(job.data.key);
  
    console.log("downloaded..............");
    console.log({ filePath });
    if(filePath==undefined){
      console.log("ERROR:filepath not found")
      return
    }
  
    await prisma.video.update({
      where: { id: job.data.id },
      data: { status: "PROCESSING" },
    });
  
    await runFFmpeg(
      filePath,
      `${job.data.key}`
    );
  
    await prisma.video.update({
      where: { id: job.data.id },
      data: {
        status: "SUCCESS",
        url: `/transcoded/${job.data.key}/master.m3u8`,
      },
    });
  
    console.log("Transcoding complete ✅");
  } catch (error) {
    console.log(error)
  }
});
