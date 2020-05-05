app.controller('networkController', function($scope, networkService,newsService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";
    $scope.selectedIssuerID = "";
    $scope.topNewsLimit = 6;

    // for the charts 

    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------


    $scope.selectedState = localStorage.getItem('state');
    // console.log($scope.selectedState);

    var list_states =['AR','DE','HI','IA','IL','KS','KY','ME','MI','MT','NE','NH','NJ','NM'
    ,'NV','OH','OR','PA','SD','UT','VA','WV','AK','AL','AZ','FL','GA','IN'
    ,'LA','MO','MS','NC','ND','OK','SC','TN','TX','WI','WY']

    networkService.networkList().then(function(data){$scope.networks= data;}); 
        if (list_states.includes($scope.selectedState))
        {
            $scope.inlistflag = true;
        }
        else{
            $scope.inlistflag = false;
        }

    // check if your selected state is in the database list

    networkService.agelist().then(function(data){$scope.agelists= data;});
    $scope.query1 = function(){networkService.querylist1($scope.selectedState).then(function(data){$scope.q1 = data;});};

    // this is the second query which gives (given a issuer id , state and age) - provides the average rate of perimuims , no of plans , avg copay and stuff 
    $scope.cont_avgrateperid = function(){networkService.service_avgrateperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.avgrateperid = data;});};

    // this function provides the benefits given a issuer id and age 
    $scope.cont_benefitperid = function(){networkService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.benefitperid = data;});};

//----------------------------------------------Get Data From the services------------------------------------------------
    $scope.networkSelection = function(){
        // function records the selectedState value (global)
        if(list_states.includes($scope.selectedState.StateCode))
        {
            $scope.inlistflag = true;
        }
        else{
            $scope.inlistflag = false;
        }
        $scope.query1();
        $scope.stateflag= true;
        $scope.ageflag= false;
        // console.log($scope.q1);
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
        // console.log( $scope.selectedIssuerID)
        $scope.issuerflag= true;
 
        var fn = await (networkService.service_avgrateperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.avgrateperid = data;}));
        
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
        //redirects to Benefits page using the issuer id provided.
        localStorage.setItem('issuerid', $scope.q1[index].IssuerId);
        localStorage.setItem('age_network',$scope.selectedAge.Age);
        window.open("/benefit");
    };

    $scope.GetDetails_Graph = async function (index) {
        // function - takes the information from the  rate information displayed extracts them to scorp values (handling lag)
        // invokes the create barchart function to get a graph 



        $scope.avgrateperid_avgpremimum = $scope.copyavgrateperid[index].Avg_Premium;
        $scope.avgrateperid_avgcopay = $scope.copyavgrateperid[index].Avg_Copay;
        $scope.avgrateperid_avgcoins = $scope.copyavgrateperid[index].Avg_Coinsurance;

        //Debug statement
        // console.log( $scope.q1[index])

        //invoke graph function
        $scope.createdg1flag= true;
        $scope.createPieChart($scope);

        // feed data in the card display first and then add a function within the calls (Async function - promise to be resolved) 
        var finish_metallevel = await ($scope.feeddata());

    };

    $scope.createPieChart = function( $scope){
            // handles the structure of the graph and the data passed through it 


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
            // functions called and gets information for a given issuer id and age , metal level plans by network provider. 

            var metaldata = {};
            var carddata = []
            var metallevelrate = await (networkService.service_metallevelrate($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){metaldata =data;console.log(data);}));
                
            
            var colorpalet = { "High" :'IndianRed' , "Low":'beige', "Bronze":'Peru', "Silver":'silver',"Catastrophic":'darkcyan','Gold':'DarkGoldenRod'};
           
            // get out of country card 
            var outofcountry ={}
            // console.log("Outof country");
            var fn_2 = await (networkService.service_outofcountry($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){outofcountry =data;console.log(data);})); 
            // console.log(outofcountry)
            var tmp_dict={}
            for( var m in outofcountry)
            {
                var metallvl= outofcountry[m].MetalLevel;
                var num_percentage = outofcountry[m].AreaandCountryCoverage *100;
                tmp_dict[metallvl] = num_percentage.toString().concat('%');
            }
            count =0;
            for ( var key in metaldata){
                var tmp={}
                tmp['level'] = metaldata[key].MetalLevel;
                metaldata[key]['color'] = colorpalet[metaldata[key].MetalLevel];
                metaldata[key]['outofcountry'] = tmp_dict[metaldata[key].MetalLevel]
                count= count+1;
                 
            }
            
            $scope.$apply(function() {
                console.log("I went into apply function");
                $scope.sensorList = metaldata;
                $scope.sensorlength =count;})

        };
                
    $scope.Get_metalgraphs = function(value){
        // console.log(value);
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

        chart.title("Rates Visualization");


        // draw
        chart.container("donughtchartrates".concat(value.MetalLevel));
        chart.draw();

    };
   
});
