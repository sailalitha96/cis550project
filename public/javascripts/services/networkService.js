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
        if(typeof(state.StateCode) === "undefined"){
    // The property DOESN'T exists
        }else{
    // The property exists
        state = state.StateCode;
        }
        return $http.get(`/network_backend_q1/state?state=${state}`).then(function(response) {
            console.log(state);
            return response.data;
        });
    };

    var service_avgrateperid = function(issuerid, age) {
        return $http.get(`/network_backend_avgrate/issuerid/${issuerid}/age/${age}`).then(function(response) {
            
            return response.data;
        });
    };

    var service_benefitperid = function(issuerid, age) {
       
        return $http.get(`/network_backend_benefitname/issuerid/${issuerid}/age/${age}`).then(function(response) {
            
            return response.data;
        });
    };


    var service_metallevelrate = function(issuerid, age) {
        return $http.get(`/network_backend_metalrate/issuerid/${issuerid}/age/${age}`).then(function(response) {
            // console.log(response.data);
            return response.data;
        });
    };
//     var productList = [];
//     var laststate = "";

//   var addState = function(newObj) {
//       productList.push(newObj);
//       laststate = newObj;
//       console.log(laststate);
//   };

//   var getState = function(){
//     console.log(productList);
//       return productList;
//   };

    return {
    //    addState:addState, 
    //    getState:getState,
       networkList:networkList,
       agelist:agelist,
       querylist1:querylist1,
       service_avgrateperid:service_avgrateperid,
       service_benefitperid:service_benefitperid,
       service_metallevelrate:service_metallevelrate,
    };
});
