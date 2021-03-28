let mongoose = require("mongoose"); // import mongoose
let {
  User
} = require('../models/user');


//Require the dev-dependencies
let chai = require('chai'); // import chai for testing assert
let chaiHttp = require('chai-http'); // make virtual server to get/post/put/delete
let server = require('../index'); // import app from index
let should = chai.should(); // import assert should from chai

chai.use(chaiHttp); // use chaiHttp


let token;
describe('/Post Login User', () => {
  it('it should login user', (done) => {
    chai.request(server) // request to server (index.js)
      .post('/user/login')
      .send({
        email: 'siwa',
        password: '123'
      })
      .end((err, res) => {
        // token = res.body.result.token;
        res.should.have.status(200); // Response Success
        res.body.should.be.an('object'); // Body Response should be an object
        res.body.should.have.property('success'); // Body Response should have 'status' property
        // res.body.should.have.property('token'); // Body Response should have 'data' property
        done();
      })
      
  })

})
  


describe('/Get User Profile', () => {
  it('it should User Profile', (done) => {
    chai.request(server) // request to server (index.js)
      .get('/user/profile')
      .set('Authorization', (token))
      .end((err, res) => {
        res.should.have.status(200); // Response Success
        res.body.should.be.an('object'); // Body Response should be an object
        // res.body.should.have.property('message'); // Body Response should have 'status' property
        done()
      })
  })
})