var mysql = require('mysql');

//local mysql db connection
var connection  = mysql.createPool({
  connectionLimit : 10,
  host     : 'database-projsql.cuhkpgkrgsey.us-east-1.rds.amazonaws.com',
  port     :  3306,
  user     : 'masterusername',
  password : 'sailalitha123',
  database : 'proj550'
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