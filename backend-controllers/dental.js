var sql = require('../db.js');

exports.getList = function(req, res) {
    console.log("getList");
    var query = 'SELECT DISTINCT(StateCode) FROM network;'
  
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
  	// var query = `SELECT DISTINCT(network.IssuerId),network.NetworkName ,network.NetworkURL as neturl FROM network WHERE network.StateCode LIKE ${state} AND network.DentalOnlyPlan LIKE '%Yes%' group by IssuerID`;
    // console.log(query);
    var query = `WITH R1 AS(SELECT
      DISTINCT(network.IssuerId) AS IssuerId,
      network.NetworkName AS Network
      FROM network
      WHERE network.StateCode LIKE ${state}
      AND network.DentalOnlyPlan LIKE '%Yes%'
      GROUP BY network.IssuerId),
      R2 AS (SELECT R1.IssuerId, R1.Network, COUNT(DISTINCT(PlanId)) AS NumPlans
      FROM rate JOIN R1 ON rate.IssuerId = R1.IssuerId
      GROUP BY R1.IssuerId)
      SELECT R2.IssuerId, R2.Network as NetworkName, R2.NumPlans,
      COALESCE(1-quality.Claims_Denials/(quality.Claims_Received+quality.Claims_Denials),'Not Available Currently') AS quality_index
      FROM R2 LEFT JOIN quality ON R2.IssuerId = quality.Issuer_ID
      GROUP BY R2.IssuerId
      ORDER BY NumPlans DESC, quality_index DESC;`
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

    var query = `WITH R1 AS
    (SELECT DISTINCT(planid) AS plans, AVG(IndividualRate_1+IndividualRate_2+IndividualRate_3) AS Premium
    FROM rate
    WHERE issuerid = ${issuerid}
    AND Age = ${age}
    GROUP BY PlanId),
    R2 AS
    (SELECT R1.plans as plans,SUM(bcs.CopayInnTier1) AS Copay,
    SUM(bcs.CoinsInnTier1) AS CoInsurance ,SUM(bcs.CopayOutofNet) AS CopayOut,SUM( bcs.CoinsOutofNet) AS CoinsOut
    FROM bcs  JOIN R1 ON R1.plans = bcs.StandardComponentId
    GROUP BY bcs.StandardComponentId , bcs.BenefitName)
    SELECT
    ROUND(AVG(R1.Premium),2) AS Avg_Premium,
    ROUND(AVG(R2.Copay),2) AS Avg_Copay,
    ROUND(AVG(R2.CoInsurance),2) AS Avg_Coinsurance
    FROM R1,R2;
    `
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
      // var query = `
      // SELECT MetalLevel_2018 AS MetalLevel,
      // ROUND(rate_by_metal_level.premium,2) AS premium,
      // ROUND(CopayInTier1) AS AvgCopayInTier1,
      // ROUND(CopayOutofNet) AS AvgCopayOutofNet,
      // ROUND(CoinsInTier1) AS AvgCoinsInTier1,
      // ROUND(CoinsOutofNet) AS AvgCoinsOutofNet
      // FROM planidcrosswalk pcw JOIN 
      // (SELECT DISTINCT(bcs.StandardComponentId) as s_Id,SUM(bcs.CopayInnTier1) AS CopayInTier1,
      // SUM(bcs.CopayOutofNet) AS CopayOutofNet ,
      // SUM(bcs.CoinsInnTier1) AS CoinsInTier1 ,
      // SUM(bcs.CoinsOutofNet) AS CoinsOutofNet
      // FROM bcs
      // JOIN (SELECT DISTINCT(rate.PlanId) as plan_Id FROM rate WHERE rate.Age LIKE ${age} AND rate.IssuerId = ${issuerid}) R1 ON  bcs.StandardComponentId = R1.plan_Id
      // GROUP BY bcs.StandardComponentId,bcs.PlanId
      // ) bcs_id 
      // ON pcw.PlanID_2018 = bcs_id.s_Id
      // JOIN
      // (SELECT pcw.MetalLevel_2018 AS MetalLevel, AVG(r.IndividualRate_1 + r.IndividualRate_2+r.IndividualRate_3) AS premium
      // FROM planidcrosswalk pcw JOIN rate r 
      // ON pcw.PlanID_2018 = r.PlanId
      // WHERE r.IssuerId =  ${issuerid} AND r.Age =  ${age}
      // GROUP BY r.PlanId
      // ORDER BY premium 
      // ) rate_by_metal_level 
      // ON rate_by_metal_level.MetalLevel = pcw.MetalLevel_2018
      // GROUP BY pcw.MetalLevel_2018;
      // `;  

      var query = `WITH R1 AS
      (SELECT DISTINCT(planid) AS plans, AVG(IndividualRate_1+IndividualRate_2+IndividualRate_3) AS Premium
      FROM rate
      WHERE issuerid = ${issuerid} AND Age =  ${age}
      GROUP BY PlanId),
      R2 AS
      (SELECT R1.plans as plans,SUM(bcs.CopayInnTier1) AS Copay,
      SUM(bcs.CoinsInnTier1) AS CoInsurance ,SUM(bcs.CopayOutofNet) AS CopayOut,SUM( bcs.CoinsOutofNet) AS CoinsOut, R1.Premium AS Premium
      FROM bcs  JOIN R1 ON R1.plans = bcs.StandardComponentId
      GROUP BY bcs.StandardComponentId , bcs.BenefitName),
      R3 AS
      (SELECT DISTINCT(R1.plans) AS plans, pcw.MetalLevel_2018 AS MetalLevel FROM planidcrosswalk pcw JOIN R1
      ON pcw.PlanID_2018 = R1.plans)
      SELECT
      R3.MetalLevel AS MetalLevel,AVG(R2.Premium) AS premium,
      AVG(R2.Copay) AS AvgCopayInTier1 ,
      AVG(R2.CopayOut) AS AvgCopayOutofNet ,
      AVG(R2.CoInsurance) AS AvgCoinsInTier1  ,
      AVG(R2.CoinsOut ) AS AvgCoinsOutofNet
      FROM R2 JOIN R3 ON R2.Plans = R3.Plans
      GROUP BY R3.MetalLevel
      ORDER BY premium;
      `
      // console.log(query);
      sql.execute(query, res);
    };