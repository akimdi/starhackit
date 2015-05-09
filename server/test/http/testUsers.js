/// <reference path="../../../typings/mocha/mocha.d.ts"/>
var assert = require('assert');
var crypto = require('crypto');
var testManager = require('../testManager');

describe('Users', function(){
  "use strict";
  this.timeout(9000);
  var client;
  require('../mochaCheck')(testManager);

  before(function(done) {
    done();
  });
  
  describe('Admin', function(){
    before(function(done) {
      client = testManager.client("admin");
      assert(client);
      client.login()
      .then(function(res){
        console.log(res);
        assert(res);
      })
      .then(done, done)
    });
    it('should get all users', function(done){
      return client.get('v1/users')
      .then(function(users){
        assert(users);
      })
      .then(done, done);
    });
    it('should get one user', function(done){
      return client.get('v1/users/1')
      .then(function(user){
        assert(user);
      })
      .then(done, done);
    });
    it.skip('should create a new user', function(done){
      var sha = crypto.createHash('sha256');
      var username = "user" + sha.update(crypto.randomBytes(8)).digest('hex');
      var userConfig = {
          username: username,  
          group: 'BankBridge'
      };
      
      return client.post('v1/users', userConfig)
      .then(function(res){
        assert(res);
        assert(!res.error);
        done();
      })
      .catch(function(err) {
        console.log(err)
      });
    });
    
    it.skip('should not create a new user with missing username', function(done){
      return client.post('v1/users')
      .catch(function(err) {
        assert.equal(err.statusCode,400);
        done();
      })
    });
  });
  
  describe('User Basic ', function(){
    before(function(done) {
      client = testManager.client("alice");
      assert(client);
      client.login()
      .then(function(res){
        console.log(res);
        assert(res);
      })
      .then(done, done);
    });
    it('should not delete on all users', function(done) {
      return client.delete('v1/users')
      .then(function(){
        done({error:"ShouldNotBeHere"});
      })
      .catch(function(err){ 
        //console.log(err);
        assert(err);
      })
      .then(done, done);
    });
  });
});

