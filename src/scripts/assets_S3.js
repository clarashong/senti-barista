import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getImageURL(key) {
    let url = `https://${process.env.REACT_APP_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`;
    return url; 
}

export { getImageURL };
