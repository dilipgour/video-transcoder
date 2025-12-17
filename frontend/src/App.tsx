import { useRef, useState, type ChangeEvent } from "react";
import "./App.css";
import axios from "axios";
import VideoPlayer from "./components/video-player";


function App() {
  const [file, setFile] = useState<null | File>(null);
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log("gshvndgcngscg");
    }
  };

  const handleClick = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("uploaded_file", file);
    }
    try {
      const { data } = await axios.post(
        "http://localhost:3000/upload",

        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent !== undefined) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total!
              );
              console.log(`Upload progress: ${percent}%`);
            }
          },
        }
      );

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick2 = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000");

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <input type="file" onChange={handleChange} />
      <button onClick={handleClick}>mhxvmhxvhx</button>
      <VideoPlayer src="http://localhost:3000//transcoded/4k_Thetestdata-1758299508727-101541081/master.m3u8"/>
    </>
  );
}

export default App;
