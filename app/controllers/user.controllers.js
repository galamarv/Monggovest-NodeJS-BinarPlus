const User = require('../model/user.models');
const Token = require('../model/token.models');
const jwt = require('jsonwebtoken');
const secretkey = "rahasia";
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const saltRounds = 10;

exports.create_user = (req, res) => {
    var user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds)
    })
    user.save(function(err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        

        // Create a verification token for this user
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the verification token
        token.save(function (err) {
            if (err) { return res.status(500).send({ pesan: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'mongovest@gmail.com' , pass: 'asdfghjklqwertyuiop' } });
            var mailOptions = { from: 'no-reply@yourwebapplication.com', to: req.body.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
    });
}


exports.show_user = (req, res, next) => {
    User.find({ _id: req.decoded._id }, (err, User) => {
        if (err) {
            res.status(422).json({
                success: false,
                message: 'failed',
                error: err
            })
        }
        else {
            res.status(200).json({
                data: User,
                success: true,
                message: "user found"
            });
        }
    });
};

exports.update_user = (req, res) => {
    User.findByIdAndUpdate({ _id: req.decoded._id }, { $set: req.body }, (err, updatedUser) => {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send({
                success: true,
                message: "User profile is sucessfully updated"
            })
        }
    })
}

exports.user_login = (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
            
        bcrypt.compare(req.body.password, user.password, function (err, response) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'failed'
                    })
                } else {
                    console.log(response)
                    if (!response) {
                        res.status(401).json({
                            message: 'wrong password or username',
                            success: false,
                            token: token
                        })
                        
                    } else {
                        if (!user.isVerified) {
                            res.status(401).json({ 
                                type: 'not-verified', 
                                message: 'Your account has not been verified.' 
                            }); 
                        } else {
                        var token = jwt.sign(user.toJSON(), secretkey, {
                            algorithm: 'HS256'
                        });
                        res.status(200).json({
                            message: 'You are logged in!',
                            success: true,
                            token: token,
                            user: user
                        })
                        }
                    }

                }
            })
        }
    )
}



exports.admin_login = (req, res) => {
    User.findOne({ email : req.body.email }, (err, user) => {
        //console.log(user);
        if (req.body.email != "admin") {
            res.status(422).json({
                success: false,
                message: 'anda bukan admin',
                error: err
            })
        }
        else {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: 'failed'
                })
            } else {
                //console.log(user)
                bcrypt.compare(req.body.password, user.password, function (err, response) {
                    if (err) {
                        res.status(400).json({
                            success: false,
                            message: 'failed'
                        })
                    } else {
                        console.log(response)
                        if (response) {
                            var token = jwt.sign(user.toJSON(), secretkey, {
                                algorithm: 'HS256'
                            });
                            res.status(201).json({
                                message: 'You are logged in!',
                                success: true,
                                token: token,
                                user : user
                            })
                        } else {
                            res.status(401).json({
                                message: 'wrong password or username',
                                success: false,
                                token: token
                            })

                        }

                    }
                })
            }
        }
    })

}


exports.konfirmasi = function (req, res, next) {

    Token.findOne({ token: req.params.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId}, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};

exports.resendToken = function (req, res, next) {
 
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
 
            // Send the email
            var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'mongovest@gmail.com' , pass: 'asdfghjklqwertyuiop' } });
            var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
 
    });
};

