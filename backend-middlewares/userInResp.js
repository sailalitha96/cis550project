// use a aws sdk for addin stuff to 
// var AWS = require('aws-sdk');
var MongoClient = require('mongodb').MongoClient;
// var mongoose = require("mongoose");
// var bcrypt = require("bcrypt-nodejs");
// AWS.config.update({
//   region: "us-east-1",
//   // The endpoint should point to the local or remote computer where DynamoDB (downloadable) is running.
//   endpoint: 'http://localhost:3000',
//   /*
//     accessKeyId and secretAccessKey defaults can be used while using the downloadable version of DynamoDB. 
//     For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
//   */
//   accessKeyId: "AKIAQQL3T7MPUZJ4SFUI",
//   secretAccessKey: "EEhXUBjspWjj/iMIddIFpEVpZ6gtf3Q0o1Vh6pVx"
// });
// // AWS.config.loadFromPath('../config.json');
// // var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-west-2'});

// var ddb = new AWS.DynamoDB({apiVersion: '2012-10-17'});
// var current_date = new Date();
// var date_time = current_date.getTime().toString();

// var put_items = function(username)
// {
//   var current_date = new Date();
//   var date_time = current_date.getTime().toString();
//   console.log("In put function")
//   // console.log(date_time)
//   var obj = {
//     'TableName': 'Userinformation',
//     'Item': {
//       'user_id' : {S: 'functions'}  ,
//       'user_id_datetime' :{S: date_time.concat('functions')}
//     }
//   }
  
//   count =0 
//   if (count <1)
//   {
//   ddb.putItem(obj, function(err, data) {
//     console.log("going to put");
//     console.log(obj);
//     if (err) {
//       console.log("Error", JSON.stringify(err, null, 2));
//     } else {
//       console.log("Success", JSON.stringify(data));
//     }});
//     count = count+1;
//   }
  

// };


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
            
            console.log('Total Rows: ' + count);
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
      fn();
      next();
   
}};