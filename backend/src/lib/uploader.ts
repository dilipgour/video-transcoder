import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(path.resolve())
    cb(null,  "C:/js/video-transcoder/transcoder/storage/raw");
  },
   filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    
    cb(null, file.originalname.split(".")[0] + '-' + uniqueSuffix + path.extname(file.originalname))
  },
   
});




export const upload = multer({ storage: storage,limits:{ fileSize: 1024 * 1024 * 1024 }  });

