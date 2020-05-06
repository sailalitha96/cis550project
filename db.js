var mysql = require('mysql');

//local mysql db connection
var connection  = mysql.createPool({
  connectionLimit : 10,
  host     : 'endpointforaws',
  port     :  3306,
  user     : '<YOUR USERNAME>',
  password : '<YOUR PASSWORD>',
  database : '<YOUR DATABASE>'
});


//A function to execute the queries and return
connection.execute = function(query,res){
  connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
  });
};


module.exports = connection;
