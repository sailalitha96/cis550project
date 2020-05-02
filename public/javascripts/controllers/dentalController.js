app.controller('dentalController', function($scope, dentalService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";
    $scope.selectedIssuerID = "";

    // for the charts 

    // $scope.width = 600;
    // $scope.height = 400;
    // $scope.yAxis = "Sales";
    // $scope.xAxis = "Axis"
    // $scope.labels = ["Average Preimum " , "Average CoPay", "Average CoInsurance"];
    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable

    $scope.selectedState = localStorage.getItem('state');
    console.log($scope.selectedState);
    dentalService.networkList().then(function(data){$scope.networks= data;}); 
    //$scope.stateid = networkService.getState();
    
    dentalService.agelist().then(function(data){$scope.agelists= data;});
    $scope.query1 = function(){dentalService.querylist1($scope.selectedState).then(function(data){$scope.q1 = data;});};

    // this is the second query which gives (given a issuer id , state and age) - provides the average rate of perimuims , no of plans , avg copay and stuff 
    $scope.cont_avgrateperid = function(){dentalService.service_avgrateperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.avgrateperid = data;});};

    // this function provides the benefits given a issuer id and age 
    $scope.cont_benefitperid = function(){dentalService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.benefitperid = data;});};
    // $scope.cont_metallevelrate =  function(){dentalService.service_metallevelrate($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.metallevelrate = data;console.log("I got binded", $scope.metallevelrate);});};

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
        $scope.query1();
        console.log($scope.selectedAge);
    };

 
    $scope.GetDetails_Issuer = function (index) {
        // this function takes in the issuer id information from the get details button and uses that to run subsqeuent queries

        $scope.selectedIssuerID = $scope.q1[index].IssuerId;
        // console.log( $scope.selectedIssuerID)
        $scope.issuerflag= true;
        $scope.cont_avgrateperid($scope.avgrateperid);
        // $scope.cont_benefitperid();

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
        $scope.createPieChart($scope);

        // feed data in the card display first and then add a function within the calls 
        console.log($scope.selectedIssuerID,$scope.selectedAge.Age)
        
        // $scope.cont_metallevelrate();
        $scope.feeddata();




        // $scope.carddisplay();

    };

    $scope.createPieChart = function( $scope){
            // handles the structure of the graph and the data passed through it 

            // debug statements
            console.log("In createPieChart");
            console.log( $scope.avgrateperid_avgcopay)

            //defintition of graph 
            var data = {
                header: ["Name", "Number"],
            rows: [
                ["Avg_Premium", $scope.avgrateperid_avgpremimum ],
                ["Avg_Copay", $scope.avgrateperid_avgcopay ],
                ["Avg_Coinsurance", $scope.avgrateperid_avgcoins]
            ]};

            // create the chart
            var chart = anychart.pie(data);

            // add data
            //chart.data(data);

            // set the chart title
            chart.title("Data Visualization");


            // draw
            chart.container("piechartrates");
            chart.draw();
        };


        // random test for cards
    $scope.feeddata = async function(){
        // var cont_metallevelrate =  function(){networkService.service_metallevelrate($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.metallevelrate = data;console.log("I got binded", $scope.metallevelrate);});};
        var metaldata = {};
        var carddata = []
        var metallevelrate = await (dentalService.service_metallevelrate($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){metaldata =data;console.log(data);}));
         
        // cont_metallevelrate().then(function(){console.log("I got binded", $scope.metallevelrate);});
        // var waits = await $scope.cont_metallevelrate();
        var colorpalet = { "High" :'gray' , "Low":'beige', "Bronze":'bronze', "Silver":'silver',"Catastrophic":'darkcyan','Gold':'Metallic Gold'};
        console.log(metaldata);
        console.log("For loop");
        // iterate through the metaldata to get info on card 
        for ( var key in metaldata){
            var tmp={}
            tmp['level'] = metaldata[key].MetalLevel;
            metaldata[key]['color'] = colorpalet[metaldata[key].MetalLevel];
            
            // tmp['premium'] = metaldata[key].premium;
            // tmp['avgcopay1'] = metaldata[key].AvgCopayInTier1;
            // tmp['avgcopaynet']= metaldata[key].AvgCopayOutofNet;
            // tmp['avgcoins1']= metaldata[key].AvgCoinsInTier1;
            // tmp['avgcoinsnet']= metaldata[key].AvgCoinsOutofNet;
            // carddata.push(tmp);
        }
        // // console.log(metaldata);
        // console.log(carddata)
        $scope.sensorList = metaldata;
        console.log($scope.sensorList);
    };
        
    $scope.Get_metalgraphs = function(value){
        console.log(value);
        var data = {
            header: ["Name", "Number"],
        rows: [
            ["Premium", value.premium ],
            ["Avg Copay", value.avgcopay1 ],
            ["Avg Coinsurance", value.avgcoins1],
            ["Avg Copay Out of Net", value.avgcopaynet ],
            ["Avg Coinsurance Out of Net", value.avgcoinsnet ],

        ]};

        // create the chart
        var chart = anychart.pie(data);

        // add data
        //chart.data(data);
        chart.radius('43%')
        chart.innerRadius('30%');
        //set chart radius
        // create empty area in pie chart
        
        // set the chart title
        chart.title("Rates Visualization");


        // draw
        chart.container("donughtchartrates");
        chart.draw();

    };
    // $scope.carddisplay= function() {
            //     $scope.sensorList = [{
            //     hour: 12,
            //     color: 'red'
            //     }, {
            //     hour: 12,
            //     color: 'green'
            //     }, {
            //     hour: 12,
            //     color: '#a3a3a3'
            //     }, {
            //     hour: 5,
            //     color: 'purple'
            //     }, {
            //     hour: 2,
            //     color: '#b68585'
            //     }, {
            //     hour: 12,
            //     color: '#d2d2d2'
            //     }, {
            //     hour: 12,
            //     color: '#c77cdf'
            //     // }, {
            //     // hour: 3,
            //     // color: '#b68585'
            //     // }, {
            //     // hour: 14,
            //     // color: 'yellow'
            //     // }, {
            //     // hour: 4,
            //     // color: 'blue'
            //     // }, {
            //     // hour: 7,
            //     // color: '#aeaeae'
            //     // }, {
            //     // hour: 12,
            //     // color: '#d4d6d7'
            //     }];
            // }
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