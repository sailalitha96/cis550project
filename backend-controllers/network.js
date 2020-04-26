var sql = require('../db.js');

exports.getList = function(req, res) {
    
    var query = 'SELECT DISTINCT(StateCode) FROM network;'
  
    sql.execute(query,res);
  };