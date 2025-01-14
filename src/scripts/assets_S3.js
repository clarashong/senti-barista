function getImageURL(key) {
    let url = `https://${process.env.REACT_APP_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`;
    console.log(url)
    return url; 
}

export { getImageURL };
