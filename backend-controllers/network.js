var sql = require('../db.js');

exports.getList = function(req, res) {
    console.log("getList");
    var query = 'SELECT DISTINCT(StateCode) FROM network ;'
  
    sql.execute(query,res);
  };

  exports.getagedistinct = function(req, res) {
  console.log("getagedistinct");
  var query = `
  SELECT DISTINCT(Age) FROM rate WHERE Age != "Family Option";
  `;  
  sql.execute(query, res);
  };

  exports.q1list = function(req, res) {
    console.log("q1list");
    var state = req.query.state;
    state = JSON.stringify(state);
    console.log(state);
  	var query = `SELECT DISTINCT(network.IssuerId),network.NetworkName FROM network WHERE network.StateCode LIKE ${state} AND network.DentalOnlyPlan LIKE '%No%' group by IssuerID`;
    console.log(query);

    sql.execute(query, res);
  };

  exports.getAvgratescopay = function(req, res) {
    // console.log("q1list");
    // var state = req.query.state;
    // state = JSON.stringify(state);
    // console.log(state);
    console.log("Go issuer id and age param")
    var issuerid = req.params.issuerid; 
    issuerid =  JSON.stringify(issuerid);
    // issuerid = parseInt(issuerid,10);
    var age= req.params.age; 
    age = JSON.stringify(age);

    // console.log("Issuer id is")
    // console.log(issuerid)
    // console.log("age id is")
    // console.log(age)
  	var query = `SELECT total.count as NumPlans , total.premium as Avg_Premium,ROUND(AVG(total.Copay)) as Avg_Copay,
    ROUND(AVG(total.CoInsurance)) as Avg_Coinsurance 
    FROM 
    (SELECT 
    temp.plan AS Plan,
    ROUND(temp.premium,2) as premium ,
    temp.count as count,
    ROUND(SUM(temp.Copay)) AS Copay, 
    ROUND(SUM(temp.CopayOutofNet)) AS CopayOutofNet, 
    ROUND(SUM(temp.CoInsurance)) AS CoInsurance, 
    ROUND(SUM(temp.CoinsOutofNet)) AS CoinsOutofNet
    FROM 
    (SELECT bcs.StandardComponentId as plan ,R1.premium as premium ,R1.count,
    MAX(bcs.CopayInnTier1) AS Copay, MAX(bcs.CopayOutofNet) AS CopayOutofNet, 
    MAX(bcs.CoinsInnTier1)AS CoInsurance, MAX(bcs.CoinsOutofNet) AS CoinsOutofNet, bcs.BenefitName
    FROM bcs JOIN 
    (SELECT DISTINCT(PlanId) ,COUNT(DISTINCT(PlanId)) as count , AVG(rate.IndividualRate_1 + rate.IndividualRate_2+rate.IndividualRate_3) AS premium
    FROM rate 
    WHERE IssuerId=  ${issuerid} 
    AND Age =  ${age})
    AS R1 ON bcs.StandardComponentId = R1.PlanID
    GROUP BY StandardComponentId,BenefitName) temp
    GROUP BY Plan) total ;`;
    // console.log(query);

    sql.execute(query, res);
  };