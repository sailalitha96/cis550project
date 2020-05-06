app.controller('networkController', function($scope, networkService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";
    $scope.selectedIssuerID = "";

    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable

    $scope.selectedState = localStorage.getItem('state');
    console.log($scope.selectedState);
    networkService.networkList().then(function(data){$scope.networks= data;}); 
    //$scope.stateid = networkService.getState();
    
    networkService.agelist().then(function(data){$scope.agelists= data;});



});
    
