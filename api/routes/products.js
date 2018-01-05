const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Moongoose = require('mongoose');
const awss3 = require('../functions/aws');

var path = require('path');

// const multer = require ('multer');
// const storage = multer.diskStorage({
//  destination: function(req, file, cb){
//    cb(null,'./uploads/');
//  },
//  filename: function (req, file, cb){
//    cb(null, new Date().toISOString() +  file.originalname);
//  }
// });


//const uploads = multer({storage:storage}); used this if you want to upload file locally

router.get('/',(req,res,next)=>{
  Product.find()
  .select ("name price _id productImage")
  .exec()
  .then(docs=>{
      const response = {
          count: docs.length,
          products : docs.map(doc =>{
              return {
                  name:doc.name,
                  price: doc.price,
                  productImage: doc.productImage,
                  _id:doc._id,
                  request :{
                      type:"GET",
                      url :"http://localhost:3000/products" + doc._id
                  }
              };
          })
      };
      res.status(200).json(response);
  })
  .catch(err =>{
      console.log(err);
      res.status(500).json({
          error:err
      })
  })
});


router.post('/',awss3.uploads.array('productimage',1),(req,res,next)=>{
   
    var p = path.parse(req.files[0].location);
    const pp =  p.name + '.'  + p.ext.replace('.','');
    const product = new Product({
  _id:new Moongoose.Types.ObjectId(),
  name:req.body.name,
  price: req.body.price,
  productImage: awss3.s3Url +  pp
});
product.save().then(result=>{
    console.log(result);
})
.catch(err => console.log(err));

    res.status(201).json({
        message: 'Handling post Reuest',
        createdProduct: product
    });
 });


 router.get('/:productId',(req,res,next)=>{
     const id = req.params.productId;
     Product.findById(id)
     .select('name price _id productImage')
    .exec()
    .then(doc=>{
        console.log("From Database", doc);
        if(doc)
        {
            res.status(200).json(doc);
        }
        else
        {
          res.status(400).json({
              message: "Not Found"
          });
        }
        
    })
     .catch(err =>{
         console.log(err);
         res.status(500).json(
             {
                 error:err
             }
         )
     });
     
 });

 router.patch('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
  Product.update({_id:id},
  { $set: updateOps})
  .exec()
  .then(result=>{
      console.log(result);
      res.status(200).json({result})
  })
  .catch(err=>{
      console.log(err);
      res.statusCode(500).json({
          error:err
      })
  });
});

router.delete('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.remove({});
 Product.remove({_id: id})
 .exec()
 .then(result=>{
     res.status(200).json(result);     
})
.catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    });
  });
});

 module.exports = router;