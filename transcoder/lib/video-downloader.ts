import fs from "fs";
import {  GetObjectCommand} from "@aws-sdk/client-s3";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { s3 } from "../../backend/src/lib/s3";





export async function videoDownloader(Key: string) {
try {
  
    const fileName = Key.split("/").pop()!;
    const outputPath =
      "C:/js/video-transcoder/transcoder/storage/raw/" + fileName + ".mp4";
  
      
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key,
      })
    );
  
    console.log(response)
    if (!response.Body) {
      throw new Error("Empty S3 body");
    }
  
    let readable: Readable;
  
    
    if (response.Body instanceof Readable) {
      readable = response.Body;
    }
    
    else {
      readable = Readable.fromWeb(response.Body as any);
    }
  
    let downloaded = 0;
  
  readable.on("data", (chunk : any ) => {
    downloaded += chunk.length;
    console.log(`⬇️ ${Math.round(downloaded / 1024 )} KB`);
  });
  
    const writeStream = fs.createWriteStream(outputPath, {
      highWaterMark: 1024 * 1024 * 4,
    });
  
    try {
    await pipeline(readable, writeStream);
    return outputPath;
  } catch (err) {
    console.error("Pipeline failed", err);
    writeStream.destroy();
    throw err;
  }
} catch (error) {
 console.log("error during download", error) 
}
  
}

