
app.factory('searchService',function($http){

    
    var bingsearch = function (querybenefit,webSearchApiClient) {
        // const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
        // const WebSearchAPIClient = require('azure-cognitiveservices-websearch');
        // let credentials = new CognitiveServicesCredentials('6e21cb64c21c4dc1b3816ab33e024e2b');
        // let webSearchApiClient = new WebSearchAPIClient(credentials);
    
        console.log("i got to search");
        webSearchApiClient.web.search(querybenefit).then((result) => {
        let properties = ["images", "webPages", "news", "videos"];
        for (let i = 0; i < properties.length; i++) {
            if (result[properties[i]]) {
                console.log(result[properties[i]].value);
            } else {
                console.log(`No ${properties[i]} data`);
            }
        }
    }).catch((err) => {
        throw err;
    })};

    return {

        bingsearch: bingsearch
    };
});