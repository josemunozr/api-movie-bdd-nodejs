"use strict"
let request = require('supertest-as-promised')
const api = require('../app')
const mongoose = require('mongoose')
const config = require('../lib/config')
const _ = require('lodash')
const host = api

request = request(host)

// escenario
describe('La Ruta de las peliculas', function () {
  
  before(() => {

    mongoose.connect(config.database)
  })

  after((done) => {
    mongoose.disconnect(done)
    mongoose.models = {}
  })

	describe('POST /movie', function () {
		it('deberia crear un pelicula', function (done) {
      let movie = {
        'title' : 'back to the future',
        'year' : '1985'
      }
      let user = {
        'username' : 'jmunoz',
        'password' : '12345678'
      }

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user
        _user.password = user.password

        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      })
      .then((res) => {
        let token = res.body.token
        return request
          .post('/movie')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send(movie)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      })
      .then((res) => {
        let body = res.body

        expect(body).to.have.property('movie')
        movie = body.movie

        expect(movie).to.have.property('title', 'back to the future')
        expect(movie).to.have.property('year', '1985')
        expect(movie).to.have.property('_id')

        done()
      })
    })
	})

  describe('una peticion Get', function () {
    it('deberia obtener todas las peliculas', function (done) {
      let movie_id
      let movie2_id
      let token

      let movie = {
        'title' : 'back to the future',
        'year' : '1985'
      }
      let movie2 = {
        'title': 'back to the future 2',
        'year': '1989'
      }

      let user = {
        'username' : 'jmunoz',
        'password' : '12345678'
      }

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user
        _user.password = user.password

        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      })
      .then((res) => {
        token = res.body.token

        return request
         .post('/movie')
         .set('Accept', 'application/json')
         .set('x-access-token', token)
         .send(movie)
         .expect(201)
         .expect('Content-Type', /application\/json/)
      })
       .then((res) => {
         movie_id = res.body.movie._id
         return request
           .post('/movie')
           .set('Accept', 'application/json')
           .set('x-access-token', token)
           .send(movie2)
           .expect(201)
           .expect('Content-Type', /application\/json/)
        })
       .then((res) => {
          movie2_id = res.body.movie._id
          return request
            .get('/movie')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /application\/json/)
       }, done)
       .then((res) => {
        let body = res.body

         expect(body).to.have.property('movies')
         expect(body.movies).to.be.an('array')
           .and.to.have.length.above(2)

         let movies = body.movies
         movie = _.find(movies, {_id: movie_id})
         movie2 = _.find(movies, {_id: movie2_id})

         expect(movie).to.have.property('_id', movie_id)
         expect(movie).to.have.property('title', 'back to the future')
         expect(movie).to.have.property('year', '1985')

         expect(movie2).to.have.property('_id', movie2_id)
         expect(movie2).to.have.property('title', 'back to the future 2')
         expect(movie2).to.have.property('year', '1989')

         done()
       }, done)
    })
  })

  describe('una peticion Get /:id', function () {
    it('deberia traer una sola pelicula', function (done) {
      let movie_id
      let token
      let movie = {
        'title': 'her',
        'year' : '2013'
      }

      let user = {
        'username' : 'jmunoz',
        'password' : '12345678'
      }

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user
        _user.password = user.password

        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      })
        .then((res) => {
          token = res.body.token

          return request
             .post('/movie')
             .set('Accept', 'application/json')
             .set('x-access-token', token)
             .send(movie)
             .expect(201)
             .expect('Content-Type', /application\/json/)
        })
       .then((res) => {
         movie_id = res.body.movie._id
         return request
          .get('/movie/' + movie_id)
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        })
       .then((res) =>{
          let body = res.body

          expect(body).to.have.property('movie')
          movie = body.movie

          expect(movie).to.have.property('_id', movie_id)
          expect(movie).to.have.property('title', 'her')
          expect(movie).to.have.property('year', '2013')

          done()
       }, done)
    })
  })

  describe('una peticion PUT /movie', function () {
    it('deberia modificar una pelicula', function (done) {
      let movie_id
      let token
      let movie = {
        'title' : 'pulp fiction',
        'year' : '1993'
      }

      let user = {
        'username' : 'jmunoz',
        'password' : '12345678'
      }

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user
        _user.password = user.password

        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      })
      .then( (res) => {
        token = res.body.token
        return request
        .post('/movie')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .send(movie)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      })
      .then((res) => {
        movie_id = res.body.movie._id
        return request
          .put('/movie/' + movie_id)
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send(movie)
          .expect(200)
          .expect('Content-Type',/application\/json/)
      })
      .then((res) => {
        let body = res.body

        expect(body).to.have.property('movie')
        movie = body.movie

        expect(movie).to.have.property('_id', movie_id)
        expect(movie).to.have.property('title', 'pulp fiction')
        expect(movie).to.have.property('year', '1993')
        done()
      }, done)
    })
  })

  describe('una peticion DELETE', function () {
    it('deberia eliminar una pelicula', function (done) {
      let movie_id
      let token
      let movie = {
        'title' : 'pulp fiction',
        'year' : '1993'
      }

      let user = {
        'username' : 'jmunoz',
        'password' : '12345678'
      }

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then((res) => {
        let _user = res.body.user
        _user.password = user.password

        return request
          .post('/auth')
          .set('Accept', 'application/json')
          .send(_user)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      })
      .then((res) => {
        token = res.body.token
        return request
        .post('/movie')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .send(movie)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      })
      .then((res) => {
        movie_id = res.body.movie._id

        return request
          .delete('/movie/' + movie_id)
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)
      })
      .then((res) => {
        let body = res.body

        expect(body).to.be.empty
        done()
      }, done)
    })
  })
})