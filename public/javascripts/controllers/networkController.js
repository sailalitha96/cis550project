app.controller('networkController', function($scope, networkService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    

    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable

    networkService.networkList().then(function(data){$scope.networks= data;}); 

//----------------------------------------------Get Data From the services------------------------------------------------
    $scope.networkSelection = function(){
        $scope.networkList();
    };
    console.log($scope.networks);
});