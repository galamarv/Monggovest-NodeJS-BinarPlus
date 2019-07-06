const User = require('../model/user.models');
const Komoditas = require('../model/komoditas.models');
const jwt = require('jsonwebtoken');
const secretkey = "rahasia";
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.komoditas_post = (req, res) => {
  const komoditas = new Komoditas({
    'foto': req.body.foto,
    'nama_ternak': req.body.nama_ternak,
    'asal': req.body.asal,
    'harga': req.body.harga
  })
  if (req.decoded.username != "admin") {
    res.status(422).json({
      success: false,
      message: 'anda bukan admin'
    })
  }
  else {
    komoditas.save()
      .then(result => {
        res.status(201).send({
          result: result
        })
      }
      ).catch(err => {
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


exports.komoditas_peternak = (req, res) => {
  _id = req.decoded._id

  Komoditas.find({ peternak: req.params.peternak }, (err, _id) => {
    if (req.decoded._id != req.params.peternak) {
      res.status(422).json({
        success: false,
        message: 'failed',
        error: err
      })
    }
    else {
      Komoditas.find({ peternak: req.params.peternak })
      .then(Post => {
        res.status(201).send({
          data: Post
        })
      }
      ).catch(err => {
        res.status(500).send({
          error: err.message
        });
      })
    }
  })
}
