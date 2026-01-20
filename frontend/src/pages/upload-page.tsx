import axios from "axios";
import { useState, type ChangeEvent } from "react";
import { v4 as uuidv4 } from 'uuid';





const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  
  
       const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleClick = async () => {
      if (!file) return;
      //console.log(file.bytes())
  let key = file.name.split(".mp4")[0]+uuidv4()
  console.log(key)
  key= "videos/"+key;
   try {
     
    const {data} = await axios.post("http://localhost:3000/getpresignedUrl",{key});
    const {url} = data
  
    const data2 = await axios.put(url,file,{
     onUploadProgress:(progressEvent)=>{
       const { loaded, total } = progressEvent;
      let precentage = Math.floor((loaded * 100) / total!);
      console.log(precentage);
       setProgress(precentage)
     },
     
    })
   
    if(data2.status==200){
      await axios.post("http://localhost:3000/upload-compelete",{key})
    }
   } catch (error) {
    console.log(error)
   }
  
  
    }
     
  return (
    <>  
        <div>
       <input type="file" onChange={handleChange} />
       <button onClick={handleClick}>upload</button>
       </div>
       <progress value={progress/100} />
       </>
 
  )
}

export default UploadPage