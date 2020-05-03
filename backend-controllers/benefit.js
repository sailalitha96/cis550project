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
    var query = `
    SELECT DISTINCT(bcs.BenefitName) as Benefits 
    FROM bcs 
    JOIN (SELECT DISTINCT(rate.PlanId) as plan_Id FROM rate WHERE rate.IssuerId=  ${issuerid}  AND rate.Age =  ${age}) R1 ON 
    bcs.StandardComponentId = R1.plan_Id;
    `;  
    sql.execute(query, res);
    };