const User = require('../model/user.models');
const jwt = require('jsonwebtoken');
const secretkey = "rahasia";
const bcrypt = require('bcrypt');

const saltRounds = 10;

	exports.create_user = (req, res) => {
	    var user = new User({
	        username: req.body.username,
	        email: req.body.email,
	        password: bcrypt.hashSync(req.body.password, saltRounds)
	    })
	user.save()
	        .then(result => {
	            res.status(201).send({
	                result: result
	            })
	        }
	        ).catch(err => {
	        res.status(500).send("Fail! Error -> " + err);
	    });
	
	}


    exports.show_user=(req,res,next)=>{
        User.find({_id:req.decoded._id}, (err,User)=>{
            if(err){
                res.status(422).json({
                    success: false,
                    message: 'failed',
                    error: err
                })
            }
              else{
                res.status(200).json({
                    data: User,
                    success:true,
                    message:"user found"
                });
              }     
        });
    };
    
    exports.update_user=(req,res)=>{
      User.findByIdAndUpdate({_id:req.decoded._id}, {$set:req.body},(err,updatedUser)=>{
          if(err){
              res.send(err)
          }else{
              res.status(200).send({
                  success:true,
                  message:"User profile is sucessfully updated"
              })
          }
      })
  }
  
  exports.user_login=(req,res)=>{
      User.findOne({username:req.body.username}, (err,user)=>{
          if(err){
              res.status(400).json({
                  success:false,
                  message: 'failed'
              })
          }else{
              console.log(user)
              bcrypt.compare(req.body.password, user.password, function(err, response){
                  if(err){
                      res.status(400).json({
                          success: false,
                          message: 'failed'
                      })
                  }else{
                      console.log(response)
                      if(response){
                          var token = jwt.sign(user.toJSON(), secretkey, {
                              algorithm:'HS256'
                          });
                          res.status(201).json({
                              message: 'You are logged in!',
                              success: true,
                              token: token
                          })
                      }else{
                          res.status(401).json({
                              message: 'wrong password or username',
                              success: false,
                              token: token
                          })
                     
                      }
  
                  }
              })
          }
      })
  }
  
  

  exports.admin_login=(req,res)=>{
    
    User.findOne({username:req.body.username}, (err,user)=>{
        if (req.body.username != "admin") {
            res.status(422).json({
              success: false,
              message: 'anda bukan admin',
              error: err
            })
          }
          else {
        if(err){
            res.status(400).json({
                success:false,
                message: 'failed'
            })
        }else{
            console.log(user)
            bcrypt.compare(req.body.password, user.password, function(err, response){
                if(err){
                    res.status(400).json({
                        success: false,
                        message: 'failed'
                    })
                }else{
                    console.log(response)
                    if(response){
                        var token = jwt.sign(user.toJSON(), secretkey, {
                            algorithm:'HS256'
                        });
                        res.status(201).json({
                            message: 'You are logged in!',
                            success: true,
                            token: token
                        })
                    }else{
                        res.status(401).json({
                            message: 'wrong password or username',
                            success: false,
                            token: token
                        })
                   
                    }

                }
            })
        }
    }})
    
}

