app.factory('userInfoService',function($http){

    var getInfo = function() {
        return $http.get("/userInfo").then(function(response) {
            console.log(response.data);
            return response.data;
        });
    };

    // var storedata_mongo = function(username,password) {

    //     return $http.get(`/storedata_mongodb/username/${username}/password/${password}`).then(function(response) {
        
    //         return response.data;
    //     });
    // };


    return {
       getInfo:getInfo,
    //    storedata_mongo:storedata_mongo,
    };
});