// use a aws sdk for addin stuff to 
var AWS = require('aws-sdk');
AWS.config.update({
  region: "us-west-1",
  // The endpoint should point to the local or remote computer where DynamoDB (downloadable) is running.
  endpoint: 'http://localhost:8081',
  /*
    accessKeyId and secretAccessKey defaults can be used while using the downloadable version of DynamoDB. 
    For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  */
  accessKeyId: "AKIAQQL3T7MPUZJ4SFUI",
  secretAccessKey: "EEhXUBjspWjj/iMIddIFpEVpZ6gtf3Q0o1Vh6pVx"
});
// AWS.config.loadFromPath('../config.json');
// var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-west-2'});

var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var current_date = new Date();
var date_time = current_date.getTime().toString();

var put_items = function(username)
{
  var current_date = new Date();
  var date_time = current_date.getTime().toString();
  // console.log("In put function")
  // console.log(date_time)
  var params = {
    TableName: 'Userinformation',
    Item: {
      'user_id' : {S:res.locals.user}  ,
      'user_id_datetime' :{S: date_time.concat(res.locals.user)}
    }
  }
  count =0 
  if (count <=1)
  {
  ddb.putItem(params, function(err, data) {
    console.log("going to put");
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }});
    count = count+1;
  }

};
module.exports = function () {
    return function (req, res, next) {
      // console.log("in middleware");
      res.locals.user = req.user;
      // add stuff to a nosql database 
      // var current_date = new Date();
      // var date_time = current_date.getTime().toString();
      // console.log(date_time);
      // put_items(res.locals.user);
      next();
   
}};