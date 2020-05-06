// var MongoClient = require('mongodb').MongoClient;
const MongoClient = require( 'mongodb' ).MongoClient;
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var userSchema = mongoose.Schema({
  username: { type: String, required: true},
  password: { type: String, required: true },});

const url = "mongodb://localhost:27017";

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('user_infotables');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};