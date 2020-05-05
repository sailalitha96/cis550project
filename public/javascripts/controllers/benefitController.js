// const searchGoogle = require('./searchGoogle');
app.controller('benefitController', function($scope, networkService,benefitService, newsService) {

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
    $scope.selectedAge = localStorage.getItem('age_network')
    $scope.selectedIssuerID = localStorage.getItem('issuerid');
    $scope.selectedIssuerIdflag= true;
    $scope.selectedageflag= true;

    console.log($scope.selectedAge);
    //states 
    networkService.networkList().then(function(data){$scope.networks= data;}); 
    //$scope.stateid = networkService.getState();
    
    networkService.agelist().then(function(data){$scope.agelists= data;});
    networkService.querylist1($scope.selectedState).then(function(data){$scope.q1 = data;});

    // this function provides the benefits given a issuer id and age 
    $scope.cont_benefitperid = function(){benefitService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge).then(function(data){$scope.benefitperid = data;});};

    var initialBenefit = async function(){
        var benefitsname = {}

        var fn = await(benefitService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge).then(function(data){benefitsname = data;}));

        for (var key in benefitsname){
            benefitsname[key]["color"] = '#'.concat((Math.random()*0xFFFFFF<<0).toString(16));
            }
        $scope.$apply(function(){$scope.benefitperid = benefitsname;});
        
        console.log($scope.benefitperid);
    };

    if($scope.selectedIssuerIdflag)
    {
        console.log($scope.selectedAge)
        $scope.cont_benefitperid();
        console.log("I went into apply function");
        initialBenefit();
    };

    $scope.selectedAgeflag = false;
    $scope.selectedIssuerIdflag= false;
    

//----------------------------------------------Get Data From the services------------------------------------------------
    $scope.networkSelection = async function(){
        // function records the selectedState value (global)
 
        $scope.selectedIssuerIdflag= true;
        var benefitsname = {}

        var fn = await (benefitService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge).then(function(data){benefitsname = data;}));

        $scope.$apply(function() {
            //console.log("I went into apply function");
            //$scope.benefitperid = benefitsname;
            console.log("I went into apply function");
            for (var key in benefitsname){
                benefitsname[key]["color"] = '#'.concat((Math.random()*0xFFFFFF<<0).toString(16));
            }
            $scope.benefitperid = benefitsname;
            console.log($scope.benefitperid);
        });

    
    };
    $scope.ageSelection = async function(){
        // function records the selectedAge value(gloabl) within this controller 
        console.log($scope.selectedState);
        $scope.ageflag= true;

        console.log($scope.selectedAge);
        // $scope.cont_benefitperid();

        var benefitsname = {}
        var fn = await (benefitService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge).then(function(data){benefitsname = data;}));

        $scope.$apply(function() {
            console.log("I went into apply function");
            for (var key in benefitsname){
                benefitsname[key]["color"] = '#'.concat((Math.random()*0xFFFFFF<<0).toString(16));
            }
            $scope.benefitperid = benefitsname;
            console.log($scope.benefitperid);
        });



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
    };

    $scope.Get_News = function(value){
        console.log(value);
        newsService.topBenefitNews(value,6).then(function(data){$scope.topNews= data;});

    };
});
