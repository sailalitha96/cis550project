app.factory('userInfoService',function($http){

    var getInfo = function() {
        return $http.get("/userInfo").then(function(response) {
        
            return response.data;
        });
    };

    return {
       getInfo:getInfo
    };
});