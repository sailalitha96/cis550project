// use a aws sdk for addin stuff to 
// var AWS = require('aws-sdk');
// var MongoClient = require('mongodb').MongoClient;
// var mongoose = require("mongoose");
// var bcrypt = require("bcrypt-nodejs");



var fn = function(username)
{
  
  MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    var db = client.db('userinfotables');
    db.collection('Persons', function (err, collection) {
        
        // collection.insert({ id: 1, firstName: 'Steve', lastName: 'Jobs' });
        collection.insert({ user_name: username, user_emailid: 'Gates' });
        collection.insert({ id: 3, firstName: 'James', lastName: 'Bond' });
        
        

        db.collection('Persons').count(function (err, count) {
            if (err) throw err;
            
            // console.log('Total Rows: ' + count);
        });
    });
  })};


module.exports = function () {
    return function (req, res, next) {
      // console.log("in middleware");
      res.locals.user = req.user;
      // add stuff to a nosql database 
      // var current_date = new Date();
      // var date_time = current_date.getTime().toString();
      // console.log(res.locals.user);
      // put_items(res.locals.user);
      // fn(res.locals.user);
      next();
   
}};