
app.factory('searchService',function($http){

    
    var bingsearch = function (querybenefit,webSearchApiClient) {
      
    
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
