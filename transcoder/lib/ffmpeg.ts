import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

export async function runFFmpeg(inputFile: string,oupFile:string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const dirName = inputFile.split(".")[0];
    const outputDir = path.resolve("C:/transcoder/storage/transcoded", dirName);

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    const inputPath = path.resolve("C:/transcoder/storage/raw", inputFile);

    // FFmpeg arguments for adaptive LS (3 variants)
    const args = [
      "-i", inputPath,
      "-filter_complex",
      "[0:v]split=3[v1][v2][v3]; \
       [v1]scale=w=1920:h=1080[v1out]; \
       [v2]scale=w=1280:h=720[v2out]; \
       [v3]scale=w=854:h=480[v3out]",
      
      // Video mappings
      "-map", "[v1out]", "-c:v:0", "libx264", "-b:v:0", "5000k", "-maxrate:v:0", "5350k", "-bufsize:v:0", "7500k",
      "-map", "[v2out]", "-c:v:1", "libx264", "-b:v:1", "2800k", "-maxrate:v:1", "2996k", "-bufsize:v:1", "4200k",
      "-map", "[v3out]", "-c:v:2", "libx264", "-b:v:2", "1400k", "-maxrate:v:2", "1498k", "-bufsize:v:2", "2100k",

      // Audio mappings
      "-map", "a:0", "-c:a:0", "aac", "-b:a:0", "192k", "-ac", "2",
      "-map", "a:0", "-c:a:1", "aac", "-b:a:1", "128k", "-ac", "2",
      "-map", "a:0", "-c:a:2", "aac", "-b:a:2", "96k",  "-ac", "2",

      // HLS output options
      "-f", "hls",
      "-hls_time", "10",
      "-hls_playlist_type", "vod",
      "-hls_flags", "independent_segments",
      "-hls_segment_type", "mpegts",
      "-hls_segment_filename", path.join(outputDir, "stream_%v", "data%03d.ts"),
      "-master_pl_name", "master.m3u8",
      "-var_stream_map", "v:0,a:0 v:1,a:1 v:2,a:2",

      path.join(outputDir, "stream_%v", "index.m3u8"),
    ];

    const ffmpeg = spawn("ffmpeg", args);

    ffmpeg.stderr.on("data", (data) => {
      console.log("FFmpeg:", data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Transcoding finished successfully");
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

