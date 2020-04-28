app.controller('networkController', function($scope, networkService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";
    $scope.selectedIssuerID = "";
    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable

    networkService.networkList().then(function(data){$scope.networks= data;}); 
    networkService.agelist().then(function(data){$scope.agelists= data;});
    $scope.query1 = function(){networkService.querylist1($scope.selectedState.StateCode).then(function(data){$scope.q1 = data;});};

    // this is the second query which gives (given a issuer id , state and age) - provides the average rate of perimuims , no of plans , avg copay and stuff 
    $scope.cont_avgrateperid = function(){networkService.service_avgrateperid($scope.selectedIssuerID.IssuerId,$scope.selectedAge.Age).then(function(data){$scope.avgrateperid = data;});};
    // this function provides the benefits given a issuer id and age 
    $scope.cont_benefitperid = function(){networkService.service_benefitperid($scope.selectedIssuerID.IssuerId,$scope.selectedAge.Age).then(function(data){$scope.benefitperid = data;});};

//----------------------------------------------Get Data From the services------------------------------------------------
    $scope.networkSelection = function(){
        // $scope.selectedAge="";
        //$scope.selectedState="";
        // $scope.q1=[];
        $scope.query1();
        $scope.stateflag= true;
        console.log($scope.q1);
    };
    $scope.ageSelection = function(){
        //$scope.selectedAge="";
        //$scope.selectedState="";
        $scope.ageflag= true;
        console.log($scope.selectedAge);
    };
    // $scope.q1Selection = function(){
    // 	$scope.query1();
    //     console.log($scope.q1);
    //     $scope.cont_avgrateperid();
    //     console.log($scope.avgrateperid);
    // };

    $scope.cont_avgrateperidSelection = function(){
        $scope.issuerflag= true;

        console.log($scope.selectedIssuerID.IssuerId);
        $scope.cont_avgrateperid();
        $scope.cont_benefitperid();
        // console.log($scope.benefitperid);
    };
});