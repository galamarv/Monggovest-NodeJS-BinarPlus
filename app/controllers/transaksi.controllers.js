const User = require('../model/user.models');
const Komoditas = require('../model/komoditas.models');
const Transaksi = require('../model/transaksi.models');
const jwt = require('jsonwebtoken');
const secretkey = "rahasia";
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.transaksi_post = (req, res) => {
    const transaksi = new Transaksi({
        _userId: req.decoded._id,
        jumlah_lot: req.body.jumlah_lot,
        nama_lengkap: req.body.nama_lengkap,
        nomor_ktp: req.body.nomor_ktp,
        bank: req.body.bank,
        harga: req.body.harga,
        _komoditasId: req.body.ternak,
        email: req.body.email
    })


    transaksi.save(function (err) {
        if (err) {
            return res.status(500).send({
                msg: err.message
            });
        }


        // Send the email
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mongovest@gmail.com',
                pass: ''
            }
        });
        var mailOptions = {
            from: 'no-reply@yourwebapplication.com',
            to: req.body.email,
            subject: 'Pembayaran Investasi',
            text: 'Hello,\n\n' + 'Silahkan lanjutkan proses pembayaran ke nomor rekening berikut\n\n' + 'Setelah melakukan pembayaran harap kirimkan bukti pembayaran dengan membalas email ini' 
        };
        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).send({
                    msg: err.message
                });
            }
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
        });
    });
}

exports.show_transaksi = (req, res) => {
    Transaksi.find({
        user: req.decoded._id
    }, (err, Transaksi) => {
        if (err) {
            res.status(422).json({
                success: false,
                message: 'failed',
                error: err
            })
        } else {
            res.status(200).json({
                data: Transaksi,
                success: true
            });
        }
    });
}

exports.verifikasi_transaksi = (req, res) => {
    Transaksi.findOne({
        _userId: req.body._userId
    }, function (err, transaksi) {
        if (transaksi.isVerified) return res.status(400).send({
            type: 'already-verified',
            msg: 'This transaction has already been verified.'
        });

        // Verify and save the user
        transaksi.isVerified = true;
        transaksi.save(function (err) {
            if (err) {
                return res.status(500).send({
                    msg: err.message
                });
            }
            res.status(200).send("The transaction has been verified.");
        });
    });

}

exports.show_transaksiAll = (req, res) => {

    if (req.decoded.email != "admin") {
        res.status(422).json({
            success: false,
            message: 'anda bukan admin',
            error: err
        })
    } else {
    Transaksi.find({isVerified: false})
    .then((result) => {
      res.status(200)
        .send({
          status: true,
          result: result,
          error: null
        })
    })
    .catch(err => {
      res.status(500).send({
        error: err.message
      });
    })
    }
}