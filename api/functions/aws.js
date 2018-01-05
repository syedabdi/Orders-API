const multer  = require('multer'),
    multerS3 = require('multer-s3'),
    fs = require('fs'),
    AWS = require('aws-sdk'),
    bucketName = 'Your bucketname';

exports.s3Url = 'https://s3.amazonaws.com/' + bucketName + '/';

AWS.config.loadFromPath('./s3_config.json');
var s3 = new AWS.S3({params: {Bucket: bucketName}});

const fileFilter = (req,file,cb) =>{
    //reject a file
    Boolean(file.mimetype ==='image/jpeg' || 
    file.mimetype === 'image/png')? cb(null, true): 
      cb(new Error('Only images are allowed') , false);
}


 exports.uploads = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName, 
        acl: 'public-read',               
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, file.originalname)
        },
        onError : function(err, next) {
            console.log('error', err);
            next(err);
          }
    }),
    limits : {
        fileSize:1024 * 1024 *5
    },
    fileFilter :fileFilter
    
});

