// const searchGoogle = require('./searchGoogle');
app.controller('benefitController', function($scope, networkService,benefitService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";
    $scope.selectedIssuerID = "";
    $scope.topNewsLimit = 6;

    // for the charts 

    // $scope.width = 600;
    // $scope.height = 400;
    // $scope.yAxis = "Sales";
    // $scope.xAxis = "Axis"
    // $scope.labels = ["Average Preimum " , "Average CoPay", "Average CoInsurance"];
    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable

    $scope.selectedState = localStorage.getItem('state');
    $scope.selectedIssuerID = localStorage.getItem('issuerid');
    console.log($scope.selectedState);
    networkService.networkList().then(function(data){$scope.networks= data;}); 
    //$scope.stateid = networkService.getState();
    
    networkService.agelist().then(function(data){$scope.agelists= data;});

    // this function provides the benefits given a issuer id and age 
    $scope.cont_benefitperid = function(){benefitService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.benefitperid = data;});};

//----------------------------------------------Get Data From the services------------------------------------------------
    $scope.networkSelection = function(){
        // function records the selectedState value (global)
 
        $scope.query1();
        $scope.stateflag= true;
        // console.log($scope.q1);
    };
    $scope.ageSelection = function(){
        // function records the selectedAge value(gloabl) within this controller 
        console.log($scope.selectedState);
        $scope.ageflag= true;
        // $scope.query1();
        console.log($scope.selectedAge);
        $scope.cont_benefitperid();

    };

    $scope.setValue= function(benefitname){
        console.log(benefitname);

        var client_obj = benefitService.benefits_client();
        // const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
        // const WebSearchAPIClient = require('azure-cognitiveservices-websearch');
        // let credentials = new CognitiveServicesCredentials('6e21cb64c21c4dc1b3816ab33e024e2b');
        // let webSearchApiClient = new WebSearchAPIClient(credentials);
            // <script src="javascripts/services/searchService.js"></script>
        console.log(client_obj);
        // searchService.bingsearch(benefitname,client_obj);
        }
});
