app.controller('networkController', function($scope, networkService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";
    $scope.selectedIssuerID = "";

    // for the charts 

    $scope.width = 600;
    $scope.height = 400;
    $scope.yAxis = "Sales";
    $scope.xAxis = "Axis"
    $scope.labels = ["Average Preimum " , "Average CoPay", "Average CoInsurance"];
    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable

    networkService.networkList().then(function(data){$scope.networks= data;}); 
    networkService.agelist().then(function(data){$scope.agelists= data;});
    $scope.query1 = function(){networkService.querylist1($scope.selectedState.StateCode).then(function(data){$scope.q1 = data;});};

    // this is the second query which gives (given a issuer id , state and age) - provides the average rate of perimuims , no of plans , avg copay and stuff 
    $scope.cont_avgrateperid = function(){networkService.service_avgrateperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.avgrateperid = data;});};

    // this function provides the benefits given a issuer id and age 
    $scope.cont_benefitperid = function(){networkService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.benefitperid = data;});};


//----------------------------------------------Get Data From the services------------------------------------------------
    $scope.networkSelection = function(){
        // function records the selectedState value (global)
 
        $scope.query1();
        $scope.stateflag= true;
        // console.log($scope.q1);
    };
    $scope.ageSelection = function(){
        // function records the selectedAge value(gloabl) within this controller 


        $scope.ageflag= true;
        console.log($scope.selectedAge);
    };

 
    $scope.GetDetails_Issuer = function (index) {
        // this function takes in the issuer id information from the get details button and uses that to run subsqeuent queries

        $scope.selectedIssuerID = $scope.q1[index].IssuerId;
        // console.log( $scope.selectedIssuerID)
        $scope.issuerflag= true;
        $scope.cont_avgrateperid($scope.avgrateperid);
        $scope.cont_benefitperid();

    };

    $scope.GetDetails_Graph = function (index) {
        // function - takes the information from the  rate information displayed extracts them to scorp values (handling lag)
        // invokes the create barchart function to get a graph 

        $scope.avgrateperid_avgpremimum = $scope.avgrateperid[index].Avg_Premium;
        $scope.avgrateperid_avgcopay = $scope.avgrateperid[index].Avg_Copay;
        $scope.avgrateperid_avgcoins = $scope.avgrateperid[index].Avg_Coinsurance;

        //Debug statement
        console.log( $scope.q1[index])

        //invoke graph function
        $scope.createdg1flag= true;
        $scope.createBarChart($scope);
    };

    $scope.createBarChart = function( $scope){
            // handles the structure of the graph and the data passed through it 

            // debug statements
            console.log("In createBarChart");
            console.log( $scope.avgrateperid_avgcopay)

            //defintition of graph 
            var data = {
                header: ["Name", "Number"],
            rows: [
                ["Avg_Premium", $scope.avgrateperid_avgpremimum ],
                ["Avg_Copay", $scope.avgrateperid_avgpremimum ],
                ["Avg_Coinsurance", $scope.avgrateperid_avgpremimum ]
            ]};

            // create the chart
            var chart = anychart.column();

            // add data
            chart.data(data);

            // set the chart title
            chart.title("Data Visualization");


            // draw
            chart.container("piechartrates");
            chart.draw();
        };



////////////////////////////////if needed use these//////////////////////////////////////
       
    // $scope.q1Selection = function(){
    // 	$scope.query1();
    //     console.log($scope.q1);
    //     $scope.cont_avgrateperid();
    //     console.log($scope.avgrateperid);
    // };

    // $scope.cont_avgrateperidSelection = function(){
    //     // $scope.issuerflag= true;

    //     // console.log($scope.selectedIssuerID.IssuerId);
    //     $scope.cont_avgrateperid();

    //     // $scope.chart1data = [$scope.avgrateperid.Avg_Premium, $scope.avgrateperid.Avg_Copay,$scope.avgrateperid.Avg_Coinsurance];
    //     $scope.cont_benefitperid();
    //     // console.log($scope.avgrateperid);
    //     if (typeof $scope.avgrateperid !== 'undefined')
    //         {$scope.chart1data = [$scope.avgrateperid.Avg_Premium, $scope.avgrateperid.Avg_Copay,$scope.avgrateperid.Avg_Coinsurance];}
    //     else
        
    //         {$scope.chart1data = [10, 35,45];}
    //     console.log($scope.chart1data);
    //     };

});