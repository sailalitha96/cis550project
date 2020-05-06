var sql = require('../db.js');



exports.getbenefitname = function(req, res) {

    var issuerid = req.params.issuerid; 
    issuerid =  JSON.stringify(issuerid);
    // issuerid = parseInt(issuerid,10);
    var age= req.params.age; 
    age = JSON.stringify(age);


    var query = `
    WITH R2 AS  (SELECT DISTINCT(StandardComponentId) as plans,(bcs.BenefitName) AS Benefits FROM bcs WHERE issuerid = ${issuerid} ) ,
    R3 AS (SELECT DISTINCT(pcw.PlanId_2018) AS plans, pcw.MetalLevel_2018 AS MetalLevel FROM planidcrosswalk pcw WHERE IssuerId_2018 = ${issuerid} )
    SELECT R2.Benefits AS Benefits FROM R2 JOIN R3 ON R2.plans = R3.plans GROUP BY Benefits ORDER BY COUNT(DISTINCT(R3.MetalLevel)) DESC LIMIT 10;
    `
    sql.execute(query, res);
    };
