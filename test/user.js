"use strict"
let request = require('supertest-as-promised')
const mongoose = require('mongoose')
const config = require('../lib/config')
const api = require('../app')
const host = api

request = request(host)

describe('Ruta para Usuarios', function() {

  before(() => {
    mongoose.connect(config.database)
  })

  after((done) => {
    mongoose.disconnect(done)
    mongoose.models = {}
  })

	describe('Post /', function() {
		it.only('deberia crear un usuario', function(done) {
      let user = {
        'username': 'jmunozr',
        'password': 'secret'
      }

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type',  /application\/json/)
        .end((err, res) => {
          let body = res.body

          expect(body).to.have.property('user')
          user = body.user

          expect(user).to.have.property('_id')
          expect(user).to.have.property('password')
          expect(user).to.have.property('username', 'jmunozr')

          done(err)
        })
    })
	})
})
