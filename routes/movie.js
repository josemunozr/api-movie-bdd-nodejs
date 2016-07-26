"use strict"
var express = require('express');
var _ = require('lodash')
var router = express.Router();
var Movie = {}

/* GET home page. */
router
.post('/', function(req, res, next) {
  console.log("POST: ", req.body)
  if( !req.body ){
  	res
  		.status(403)
      .json({error: true, message: 'Body empty'})
  }

  let _movie = req.body
  _movie._id  = Date.now()

  Movie[_movie._id] = _movie

  res
    .status(201)
    .json({movie: Movie[_movie._id]})
})

.get('/', function(req, res, next) {
  console.log("GET: ",  req.body)
  res
    .status(200)
    .json({movies: _.values(Movie)})
})

.get('/:id', function(req, res, next) {
  console.log("GET: /:id ", req.params.id)

  if(!req.params.id){
    res
    .status(403)
    .json({error: true, message: 'Params empty'})
  }

  let movie = Movie[req.params.id]
  res
    .status(200)
    .json({movie: movie})
})

.put('/:id', function(req, res, next) {
  console.log("PUT:id ", req.params.id)

  if(!req.params.id && !req.body){
    res
    .status(403)
    .json({error: true, message: 'Params empty'})
  }

  let new_movie = req.body
  new_movie._id = parseInt(req.params.id, 10)

  Movie[new_movie._id] = new_movie
  new_movie = Movie[req.params.id]

  res
   .status(200)
   .json({movie: new_movie}) 

})

module.exports = router;
