import { exec } from "child_process";

export function probeAudioStreams(inputFile: string): Promise<
  { index: number; language?: string; title?: string }[]
> {
  return new Promise((resolve, reject) => {
    exec(
      `ffprobe -v error -select_streams a \
       -show_entries stream=index:stream_tags=language,title \
       -of json "${inputFile}"`,
      (err, stdout) => {
        if (err) return reject(err);

        const data = JSON.parse(stdout);
        const streams = (data.streams || []).map((s: any) => ({
          index: s.index,
          language: s.tags?.language,
          title: s.tags?.title,
        }));

        resolve(streams);
      }
    );
  });
}
