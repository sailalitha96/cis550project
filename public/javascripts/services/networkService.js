app.factory('networkService',function($http){
    var networkList = function() {
        return $http.get("/network_backend_states").then(function(response) {
            
            return response.data;
        });
    };

    var agelist = function() {
        return $http.get("/network_backend_ages").then(function(response) {
            
            return response.data;
        });
    };

    var querylist1 = function(state) {
        return $http.get(`/network_backend_q1/state?state=${state}`).then(function(response) {
            
            return response.data;
        });
    };

    var service_avgrateperid = function(issuerid, age) {
        return $http.get(`/network_backend_avgrate/issuerid/${issuerid}/age/${age}`).then(function(response) {
            
            return response.data;
        });
    };

    return {
       networkList:networkList,
       agelist:agelist,
       querylist1:querylist1,
       service_avgrateperid:service_avgrateperid
    };
});