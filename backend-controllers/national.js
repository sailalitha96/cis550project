var sql = require('../db.js');

exports.nat_getList = function(req, res) {
    console.log("getList");
    var query = 'SELECT DISTINCT(State) FROM rankings ;'
    console.log(query);
    sql.execute(query,res);
  };

exports.nat_getagedistinct = function(req, res) {
  console.log("getagedistinct");
  var query = `
  SELECT DISTINCT(Age) FROM rate WHERE Age != "Family Option";
  `;  
  sql.execute(query, res);
  };



 exports.nat_stateinfo = function(req, res) {
   console.log("nat_stateinfo");
    var state = req.query.state;
    state = JSON.stringify(state);
    var query = `SELECT * FROM state_rankings WHERE State LIKE ${state} ;`;
    // console.log(query);
    sql.execute(query,res);
  };
