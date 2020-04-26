app.factory('networkService',function($http){
    var networkList = function() {
        return $http.get("/network").then(function(response) {
            
            return response.data;
        });
    };

    return {
       networkList:networkList,
    };
});