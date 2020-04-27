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

    return {
       networkList:networkList,
       agelist:agelist,
       querylist1:querylist1
    };
});