app.factory('benefitService',function($http){
   
    var service_benefitperid = function(issuerid, age) {
        return $http.get(`/network_backend_benefitname/issuerid/${issuerid}/age/${age}`).then(function(response) {
            
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
