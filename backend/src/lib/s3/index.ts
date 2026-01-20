import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";


export const s3 = new S3Client({
  region: 'us-east-1',
  credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
    responseChecksumValidation:"WHEN_REQUIRED",
    useAccelerateEndpoint: true
});




export const getPreSignedUrl = async(Key:string)=>{
 

try {

console.log(Key)

const command = new PutObjectCommand({
   Bucket:process.env.BUCKET_NAME,
     Key

});
const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
console.log(url)

return {error : null, url}

} catch (error) {
    console.log(error)
    return {error, url:null}
}
}
