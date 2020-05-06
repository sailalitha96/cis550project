
app.factory('nationalService',function($http){
    var statelist = function() {
        return $http.get("/national_backend_rankings/").then(function(response) {
            console.log("response data is");
            console.log(response.data);
            return response.data;
        });
    };

    var agelist = function() {
        return $http.get("/network_backend_ages").then(function(response) {
            
            return response.data;
        });
    };

    var ser_stateinfo = function(state) {
        if(typeof(state.State) === "undefined"){
    // The property DOESN'T exists
        }else{
    // The property exists
        state = state.State;
        }
        return $http.get(`/national_backend_stateinfo/state?state=${state}`).then(function(response) {
            console.log(response.data);
            return response.data;
        });
    };

    var ser_columns = function() {
        return $http.get('/national_backend_columns/columns').then(function(response) {
            console.log("response data is");
            console.log(response.data);
            return response.data;
        });
    };

    var ser_mapdata = function(crit){

        crit = crit.split(' ').join(''); 
        console.log(crit);
        return $http.get(`/national_backend_mapdata/crit?crit=${crit}`).then(function(response) {
            console.log("service map data");
            console.log(response.data);
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


    return {
  
       statelist:statelist,
       agelist:agelist,
       ser_stateinfo:ser_stateinfo,
       service_avgrateperid:service_avgrateperid,
       service_benefitperid:service_benefitperid,
       service_metallevelrate:service_metallevelrate,
       ser_columns:ser_columns,
       ser_mapdata: ser_mapdata,
    };
});
