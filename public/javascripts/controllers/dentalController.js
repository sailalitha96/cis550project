app.controller('dentalController', function($scope, dentalService,newsService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";
    $scope.selectedIssuerID = "";
    $scope.topNewsLimit = 6;

    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------


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

//----------------------------------------------Get Data From the services------------------------------------------------
    $scope.networkSelection = function(){
        // function records the selectedState value (global)
 
        $scope.query1();
        $scope.stateflag= true;
    };

    $scope.ageSelection = function(){
        // function records the selectedAge value(gloabl) within this controller 
        console.log($scope.selectedState);
        $scope.ageflag= true;
        $scope.query1();
        console.log($scope.selectedAge);
    };

 
    $scope.GetDetails_Issuer = async function (index) {
        // this function takes in the issuer id information from the get details button and uses that to run subsqeuent queries

        $scope.selectedIssuerID = $scope.q1[index].IssuerId;
        $scope.networknameselected = $scope.q1[index].NetworkName;
        $scope.issuerflag= true;

        // async function waits for the getting Avg estimated rates. 
        var fn = await (dentalService.service_avgrateperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.avgrateperid = data;}));
        
        $scope.$apply(function(){$scope.copyavgrateperid = $scope.avgrateperid
        console.log($scope.avgrateperid);
        if($scope.avgrateperid[0].Avg_Premium == 0){
            $scope.avgrateperid[0].Avg_Premium = "Information not available";}
        else{$scope.avgrateperid_avgpremimum = $scope.avgrateperid.Avg_Premium;}
        if($scope.avgrateperid[0].Avg_Copay == 0){
            $scope.avgrateperid[0].Avg_Copay = "Information not available";}
        else{$scope.avgrateperid_avgcopay = $scope.avgrateperid.Avg_Copay;}
        if($scope.avgrateperid[0].Avg_Coinsurance == 0){$scope.avgrateperid[0].Avg_Coinsurance = "Information not available";
        }else{$scope.avgrateperid_avgcoins = $scope.avgrateperid.Avg_Coinsurance;}
    });

    };

    $scope.GotoBenefits = function(index){
        // redirects to benefit page
        localStorage.setItem('issuerid', $scope.q1[index].IssuerId);
        window.open("/benefit");
    };

    $scope.GetDetails_Graph = async function (index) {
        // function - takes the information from the  rate information displayed extracts them to scorp values (handling lag)
        // invokes the create barchart function to get a graph 

        $scope.avgrateperid_avgpremimum = $scope.copyavgrateperid[index].Avg_Premium;
        $scope.avgrateperid_avgcopay = $scope.copyavgrateperid[index].Avg_Copay;
        $scope.avgrateperid_avgcoins = $scope.copyavgrateperid[index].Avg_Coinsurance;

        //Debug statement
        console.log( $scope.q1[index])

        //invoke graph function
        $scope.createdg1flag= true;
        $scope.createPieChart($scope);

        // feed data in the card display first and then add a function within the calls 
        console.log($scope.selectedIssuerID,$scope.selectedAge.Age)
        
        // we wait for the metallevel data to be completed in a async function
        var finish_metallevel = await ($scope.feeddata());

        // $scope.carddisplay();

    };

    $scope.createPieChart = function( $scope){
            // handles the structure of the graph and the data passed through it 

            // debug statements
            // console.log("In createPieChart");
            // console.log( $scope.avgrateperid_avgcopay)
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
        // var colorpalet = { "High" :'gray' , "Low":'beige', "Bronze":'bronze', "Silver":'silver',"Catastrophic":'darkcyan','Gold':'Metallic Gold'};

        var colorpalet = { "High" :'IndianRed' , "Low":'beige', "Bronze":'Peru', "Silver":'silver',"Catastrophic":'darkcyan','Gold':'DarkGoldenRod'};
        console.log(metaldata);
        console.log("For loop");
        // iterate through the metaldata to get info on card 
        count =0;
        for ( var key in metaldata){
            var tmp={}
            tmp['level'] = metaldata[key].MetalLevel;
            metaldata[key]['color'] = colorpalet[metaldata[key].MetalLevel];
            count = count+1;
            
        }
    

        $scope.$apply(function() {
            console.log("I went into apply function");
            $scope.sensorList = metaldata;
        $scope.sensorlength = count;})

        console.log($scope.sensorList);
        // $scope.sensorList = metaldata;
        // console.log($scope.sensorList);
    };
        
    $scope.Get_metalgraphs = function(value){
        console.log(value);
        var data = {
            header: ["Name", "Number"],
        rows: [
            ["Premium", value.premium ],
            ["Avg Copay", value.AvgCopayInTier1 ],
            ["Avg Coinsurance", value.AvgCoinsInTier1],
            ["Avg Copay Out of Net", value.AvgCopayOutofNet ],
            ["Avg Coinsurance Out of Net", value.AvgCoinsOutofNet ],

        ]};

        // create the chart
        var chart = anychart.pie(data);

        // add data
        //chart.data(data);
        chart.radius('43%')
        chart.innerRadius('30%');
        
        // set the chart title
        chart.title("Rates Visualization");


        // draw
        chart.container("donughtchartrates".concat(value.MetalLevel));

        chart.draw();

    };
  
});
