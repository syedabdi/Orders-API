# Order API
 Creating a RESTful API with Node.js and utilize AWS S3 for storing and retrieving the images for products and orders.

## Tools
-Node.js
-Express
-AWS S3
-AWS SDK
-Multer
-Multer S3



## Usage
 ```git clone``` it and thereafter run ```npm install```.


## Things need to set

###MongoDB Atlas
Make sure to also add your Mongo Atlas Admin Username to a nodemon.json file.
```
{
    "env": {
        "MONGO_ATLAS_PW": "YOUR_MONGO_USER_PW"
    }
}
```

###AWS S3 bucket
```
--Set IAM in AWS having permission for S3
{
    "accessKeyId": "Your_key",
    "secretAccessKey": "Your_SecretKey",
    "region": "Your_Region"
}
```

```
  bucketName = 'your bucket name';
```
