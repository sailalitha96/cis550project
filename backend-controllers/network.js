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
  	var query = `SELECT DISTINCT(network.IssuerId),network.NetworkName ,network.NetworkURL as neturl FROM network WHERE network.StateCode LIKE ${state} AND network.DentalOnlyPlan LIKE '%No%' group by IssuerID`;
    // console.log(query);

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
  	var query = `SELECT  total.premium as Avg_Premium,ROUND(AVG(total.Copay)) as Avg_Copay,
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

  exports.getbenefitname = function(req, res) {

    var issuerid = req.params.issuerid; 
    issuerid =  JSON.stringify(issuerid);
    // issuerid = parseInt(issuerid,10);
    var age= req.params.age; 
    age = JSON.stringify(age);
    // console.log("getagedistinct");
    var query = `
    SELECT DISTINCT(bcs.BenefitName) as Benefits 
    FROM bcs 
    JOIN (SELECT DISTINCT(rate.PlanId) as plan_Id FROM rate WHERE rate.IssuerId=  ${issuerid}  AND rate.Age =  ${age}) R1 ON 
    bcs.StandardComponentId = R1.plan_Id;
    `;  
    sql.execute(query, res);
    };
  
  exports.getmetallevelrates = function(req, res) {
      var issuerid = req.params.issuerid; 
      issuerid =  JSON.stringify(issuerid);
      // issuerid = parseInt(issuerid,10);
      var age= req.params.age; 
      age = JSON.stringify(age);
      console.log("getmetallevelrates");
      var query = `
      SELECT MetalLevel_2018 AS MetalLevel,
      ROUND(rate_by_metal_level.premium,2) AS premium,
      ROUND(CopayInTier1) AS AvgCopayInTier1,
      ROUND(CopayOutofNet) AS AvgCopayOutofNet,
      ROUND(CoinsInTier1) AS AvgCoinsInTier1,
      ROUND(CoinsOutofNet) AS AvgCoinsOutofNet
      FROM planidcrosswalk pcw JOIN 
      (SELECT DISTINCT(bcs.StandardComponentId) as s_Id,SUM(bcs.CopayInnTier1) AS CopayInTier1,
      SUM(bcs.CopayOutofNet) AS CopayOutofNet ,
      SUM(bcs.CoinsInnTier1) AS CoinsInTier1 ,
      SUM(bcs.CoinsOutofNet) AS CoinsOutofNet
      FROM bcs
      JOIN (SELECT DISTINCT(rate.PlanId) as plan_Id FROM rate WHERE rate.Age LIKE '%23%' AND rate.IssuerId = 12303) R1 ON  bcs.StandardComponentId = R1.plan_Id
      GROUP BY bcs.StandardComponentId,bcs.PlanId
      ) bcs_id 
      ON pcw.PlanID_2018 = bcs_id.s_Id
      JOIN
      (SELECT pcw.MetalLevel_2018 AS MetalLevel, AVG(r.IndividualRate_1 + r.IndividualRate_2+r.IndividualRate_3) AS premium
      FROM planidcrosswalk pcw JOIN rate r 
      ON pcw.PlanID_2018 = r.PlanId
      WHERE r.IssuerId =  ${issuerid} AND r.Age =  ${age}
      GROUP BY r.PlanId
      ORDER BY premium 
      ) rate_by_metal_level 
      ON rate_by_metal_level.MetalLevel = pcw.MetalLevel_2018
      GROUP BY pcw.MetalLevel_2018;
      `;  
      // console.log(query);
      sql.execute(query, res);
    };