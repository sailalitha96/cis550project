app.controller('networkController', function($scope, networkService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";

    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable

    networkService.networkList().then(function(data){$scope.networks= data;}); 
    networkService.agelist().then(function(data){$scope.agelists= data;});
    $scope.query1 = function(){networkService.querylist1($scope.selectedState.StateCode).then(function(data){$scope.q1 = data;});};
    
//----------------------------------------------Get Data From the services------------------------------------------------
    $scope.networkSelection = function(){
        //$scope.selectedAge="";
        //$scope.selectedState="";
        // $scope.q1=[];
        $scope.query1();
        console.log($scope.q1);
    };
    $scope.ageSelection = function(){
        //$scope.selectedAge="";
        //$scope.selectedState="";
        console.log($scope.selectedAge);
    };
    $scope.q1Selection = function(){
    	$scope.query1();
        console.log($scope.q1);
    };
});