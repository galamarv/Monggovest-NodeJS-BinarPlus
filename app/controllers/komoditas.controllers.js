const User = require('../model/user.models');
const Komoditas = require('../model/komoditas.models');
const jwt = require('jsonwebtoken');
const secretkey = "rahasia";
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.komoditas_post = (req, res) => {
  console.log("tes");
  const komoditas = new Komoditas({
    'nama_ternak': req.body.nama_ternak,
    'foto': req.body.foto,
    'asal': req.body.asal,
    'harga': req.body.harga
  })

  if (req.decoded.username != "admin") {
    res.status(422).json({
      success: false,
      message: 'anda bukan admin'
    })
  } else {
    komoditas.save()
      .then(result => {
        res.status(201).send({
          result: result
        })
      }).catch(err => {
        res.status(500).send({
          error: err.message
        });
      })
  }
}

exports.show_komoditas = (req, res) => {
  Komoditas.find({})
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


exports.show_komoditas_detail = (req, res, next) => {
  Komoditas.find({
    _id: req.params.id
  }, (err, result) => {
    if (err) {
      res.status(422).json({
        success: false,
        message: 'failed',
        error: err
      })
    } else {
      res.status(200).json({
        result: result
      });
    }
  });
};

exports.cari_komoditas = (req, res, next) => {
  //const regex = new RegExp(escapeRegex(req.body.text), 'gi');
  const tekscari = req.body.text;
  var regex = new RegExp("/^" + tekscari + "$/", "i");
  Komoditas.find(
    { $or: [ {asal: new RegExp(tekscari, 'i')}, {nama_ternak: new RegExp(tekscari, 'i')}] }
  , (err, result) => {
    if (err) {
      res.status(422).json({
        success: false,
        message: 'failed',
        error: err
      })
    } else {
      res.status(200).json({
        result: result
      });
    }
  });

}

// function escapeRegex(text) {
//   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// };