var sql = require('../db.js');

exports.getList = function(req, res) {
    console.log("getList");
    var query = 'SELECT DISTINCT(StateCode) FROM network;'
  
    sql.execute(query,res);
  };

  exports.getagedistinct = function(req, res) {
  console.log("getagedistinct");
  var query = `
  SELECT DISTINCT(Age) FROM rate;
  `;  
  sql.execute(query, res);
  };

  exports.q1list = function(req, res) {
    console.log("q1list");
    var state = req.query.state;
    state = JSON.stringify(state);
    console.log(state);
  	var query = `SELECT DISTINCT(network.IssuerId),network.NetworkName FROM network WHERE network.StateCode LIKE ${state} AND network.DentalOnlyPlan LIKE '%No%'`;
    console.log(query);

    sql.execute(query, res);
  };