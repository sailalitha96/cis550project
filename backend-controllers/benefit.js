var sql = require('../db.js');

const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

exports.getclient = function(req, res){
    let credentials = new CognitiveServicesCredentials('6e21cb64c21c4dc1b3816ab33e024e2b');
    let webSearchApiClient = new WebSearchAPIClient(credentials);
    // return webSearchApiClient;
};

exports.getbenefitname = function(req, res) {

    var issuerid = req.params.issuerid; 
    issuerid =  JSON.stringify(issuerid);
    // issuerid = parseInt(issuerid,10);
    var age= req.params.age; 
    age = JSON.stringify(age);
    // console.log("getagedistinct");
    var query =`
    WITH R1 AS  (SELECT DISTINCT(planid) AS plans FROM rate  WHERE issuerid = ${issuerid}  AND Age LIKE ${age}  GROUP BY PlanId), 
R2 AS  (SELECT DISTINCT(R1.plans) as plans,(bcs.BenefitName) AS Benefits FROM bcs  JOIN R1 ON R1.plans = bcs.StandardComponentId) ,
R3 AS (SELECT DISTINCT(R1.plans) AS plans, pcw.MetalLevel_2018 AS MetalLevel FROM planidcrosswalk pcw JOIN R1 ON pcw.PlanID_2018 = R1.plans)

SELECT R2.Benefits FROM R2 JOIN R3 ON R2.Plans = R3.Plans GROUP BY R2.Benefits ORDER BY COUNT(DISTINCT(R3.MetalLevel)) DESC LIMIT 10;
    `;  
    sql.execute(query, res);
    };