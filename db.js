var mysql = require('mysql');

//local mysql db connection
var connection  = mysql.createPool({
  connectionLimit : 10,
  host     : 'mysqlproj550.cuhkpgkrgsey.us-east-1.rds.amazonaws.com',
  port     :  3306,
  user     : 'masteruserame',
  password : 'rutuja123',
  database : 'mysql_proj550'
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