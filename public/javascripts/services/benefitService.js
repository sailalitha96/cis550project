app.factory('benefitService',function($http){
   
    var service_benefitperid = function(issuerid, age) {
        // console.log(age);
        if(typeof(age.Age) === "undefined"){
            // The property DOESN'T exists
                }else{
            // The property exists
                age = age.Age;
                }

        if(typeof(issuerid.IssuerId) === "undefined"){
            // The property DOESN'T exists
                }else{
            // The property exists
            issuerid = issuerid.IssuerId
                }
                // console.log(age);
        return $http.get(`/benefit_backend_benefitname/issuerid/${issuerid}/age/${age}`).then(function(response) {
            
            return response.data;
        });
    };

    var benefits_client = function() {
        return $http.get(`/network_backend`).then(function(response) {
            
            return response;

    });
};



    return {
    //    addState:addState, 
    //    getState:getState,
    //    networkList:networkList,
    //    agelist:agelist,
    //    querylist1:querylist1,
    //    service_avgrateperid:service_avgrateperid,
       service_benefitperid:service_benefitperid,
       benefits_client:benefits_client
    //    service_metallevelrate:service_metallevelrate,
    };
});
