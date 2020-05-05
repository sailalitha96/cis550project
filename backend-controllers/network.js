var sql = require('../db.js');

exports.getList = function(req, res) {
    console.log("getList");
    var query = 'SELECT DISTINCT(StateCode) FROM network ;'
  
    sql.execute(query,res);
  };

  exports.getagedistinct = function(req, res) {
  console.log("getagedistinct");
  // var query = `
  // SELECT DISTINCT(Age) FROM rate WHERE Age != "Family Option";
  // `;  
  var query = `SELECT * FROM agecolumn;`;
  sql.execute(query, res);
  };

  exports.q1list = function(req, res) {
    console.log("q1list");
    var state = req.query.state;
    state = JSON.stringify(state);
    console.log(state);
    // var query = `SELECT DISTINCT(network.IssuerId),network.NetworkName ,network.NetworkURL as neturl FROM network WHERE network.StateCode LIKE ${state} AND network.DentalOnlyPlan LIKE '%No%' group by IssuerID`;
    var query = `WITH R1 AS(SELECT
      DISTINCT(network.IssuerId) AS IssuerId,
      network.NetworkName AS Network
      FROM network
      WHERE network.StateCode LIKE ${state}
      AND network.DentalOnlyPlan LIKE '%No%'
      GROUP BY network.IssuerId),
      R2 AS (SELECT R1.IssuerId, R1.Network, COUNT(DISTINCT(PlanId)) AS NumPlans
      FROM rate JOIN R1 ON rate.IssuerId = R1.IssuerId
      GROUP BY R1.IssuerId)
      SELECT R2.IssuerId, R2.Network as NetworkName, R2.NumPlans,
      COALESCE(1-quality.Claims_Denials/(quality.Claims_Received+quality.Claims_Denials),'Not Available Currently') AS quality_index
      FROM R2 LEFT JOIN quality ON R2.IssuerId = quality.Issuer_ID
      GROUP BY R2.IssuerId
      ORDER BY NumPlans DESC, quality_index DESC;`
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
  	// var query = `SELECT  total.premium as Avg_Premium,ROUND(AVG(total.Copay)) as Avg_Copay,
    // ROUND(AVG(total.CoInsurance)) as Avg_Coinsurance 
    // FROM 
    // (SELECT 
    // temp.plan AS Plan,
    // ROUND(temp.premium,2) as premium ,
    // temp.count as count,
    // ROUND(SUM(temp.Copay)) AS Copay, 
    // ROUND(SUM(temp.CopayOutofNet)) AS CopayOutofNet, 
    // ROUND(SUM(temp.CoInsurance)) AS CoInsurance, 
    // ROUND(SUM(temp.CoinsOutofNet)) AS CoinsOutofNet
    // FROM 
    // (SELECT bcs.StandardComponentId as plan ,R1.premium as premium ,R1.count,
    // MAX(bcs.CopayInnTier1) AS Copay, MAX(bcs.CopayOutofNet) AS CopayOutofNet, 
    // MAX(bcs.CoinsInnTier1)AS CoInsurance, MAX(bcs.CoinsOutofNet) AS CoinsOutofNet, bcs.BenefitName
    // FROM bcs JOIN 
    // (SELECT DISTINCT(PlanId) ,COUNT(DISTINCT(PlanId)) as count , AVG(rate.IndividualRate_1 + rate.IndividualRate_2+rate.IndividualRate_3) AS premium
    // FROM rate 
    // WHERE IssuerId=  ${issuerid} 
    // AND Age =  ${age})
    // AS R1 ON bcs.StandardComponentId = R1.PlanID
    // GROUP BY StandardComponentId,BenefitName) temp
    // GROUP BY Plan) total ;`;
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
    WITH R1 AS  (SELECT DISTINCT(planid) AS plans FROM rate  WHERE issuerid = ${issuerid}  AND Age LIKE ${age}  GROUP BY PlanId), 
    R2 AS  (SELECT DISTINCT(R1.plans) as plans,(bcs.BenefitName) AS Benefits FROM bcs  JOIN R1 ON R1.plans = bcs.StandardComponentId) ,
    R3 AS (SELECT DISTINCT(R1.plans) AS plans, pcw.MetalLevel_2018 AS MetalLevel FROM planidcrosswalk pcw JOIN R1 ON pcw.PlanID_2018 = R1.plans)

    SELECT R2.Benefits FROM R2 JOIN R3 ON R2.Plans = R3.Plans GROUP BY R2.Benefits ORDER BY COUNT(DISTINCT(R3.MetalLevel)) DESC LIMIT 10;
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
      // JOIN (SELECT DISTINCT(rate.PlanId) as plan_Id FROM rate WHERE rate.Age =${age}  AND rate.IssuerId = ${issuerid}) R1 ON  bcs.StandardComponentId = R1.plan_Id
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


exports.getoutofcountry = function(req, res) {

  var issuerid = req.params.issuerid; 
  issuerid =  JSON.stringify(issuerid);
  // issuerid = parseInt(issuerid,10);
  var age= req.params.age; 
  age = JSON.stringify(age);
  // console.log("getagedistinct");
  var query = `
  WITH R1 AS
  (SELECT DISTINCT(PlanId) AS Plan FROM rate WHERE IssuerId = ${issuerid} AND Age LIKE ${age}),
  R2  AS
  (SELECT DISTINCT(R1.Plan) as Plan, pcw.MetalLevel_2018 AS MetalLevel FROM planidcrosswalk pcw JOIN R1
  ON pcw.PlanID_2018 = R1.Plan),
  R3 AS
  (SELECT r.MetalLevel as MetalLevel,Count(p.OutOfServiceAreaCoverage) as AreaCoverage, Count(OutOfCountryCoverage) AS CountryCoverage  , Count(DISTINCT(StandardComponentId)) as plans ,Count(DISTINCT(PlanId)) as num_var
   FROM attributes p JOIN R2  r ON p.StandardComponentId = r.Plan  AND p.OutOfServiceAreaCoverage LIKE '%Yes%'
  AND p.OutOfCountryCoverage LIKE '%Yes%'
  GROUP by r.MetalLevel),
  R4 AS
  (Select Count(R2.Plan) as num_plans, R2.Metallevel
  FROM R2
  GROUP BY R2.MetalLevel )
  SELECT DISTINCT R4.MetalLevel,
  COALESCE(ROUND(R3.plans/(R4.num_plans),2),0) AS AreaandCountryCoverage
  FROM R3 RIGHT OUTER JOIN R4 ON R3.MetalLevel = R4.MetalLevel;
  `;  
  
  sql.execute(query, res);
  };