app.controller('nationalController', function($scope, nationalService) {

    //----------------------------------------------Page view configurations------------------------------------------------
  
    $scope.selectedState = "";
    $scope.selectedAge = "";
    $scope.selectedIssuerID = "";
    $scope.topNewsLimit = 6;
    //$scope.selectedCriteria = "";
    $scope.selectedCriterianame = "";


    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable

    $scope.selectedState = localStorage.getItem('state');
    // location.pathname = '/national'
    // if(localStorage.getItem('criteria'))
    // {
    //     $scope.selectedCriterianame = localStorage.getItem('criteria').Field;
    // }
    console.log(location.pathname)
    console.log($scope.selectedState);
    nationalService.statelist().then(function(data){$scope.networks= data;}); 

    // create a dict 
    var colordict ={}
    for (i = 1; i <= 51; i++) {
        if (i<=10)
            {colordict[i]='darkcyan'} 
        else if  (i>10 && i<=20)
        {colordict[i]='green'}
        else if (i>20 && i<=30)
        {colordict[i]='yellow'}
        else if (i>30 && i<=40)
        {colordict[i]='orange'}
        else if(i>40)
        {colordict[i]='red'}

    }
    $scope.colordict = colordict;
    //$scope.stateid = networkService.getState();
    
    // nationalService.agelist().then(function(data){$scope.agelists= data;});
    // $scope.query1 = function(){nationalService.querylist1($scope.selectedState).then(function(data){$scope.q1 = data;});};

    // this is the second query which gives (given a issuer id , state and age) - provides the average rate of perimuims , no of plans , avg copay and stuff 
    // $scope.cont_avgrateperid = function(){networkService.service_avgrateperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.avgrateperid = data;});};

    // this function provides the benefits given a issuer id and age 
    // $scope.cont_benefitperid = function(){networkService.service_benefitperid($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.benefitperid = data;});};
    // $scope.cont_metallevelrate =  function(){networkService.service_metallevelrate($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.metallevelrate = data;console.log("I got binded", $scope.metallevelrate);});};


    // given the state return the things for various headers.
    nationalService.cont_stateinfo = function(){nationalService.ser_stateinfo($scope.selectedState).then(function(data){$scope.states_info = data;});};
    nationalService.ser_columns().then(function(data){$scope.agelists = data;});
//----------------------------------------------Get Data From the services------------------------------------------------
    // $scope.networkSelection = function(){
    //     // function records the selectedState value (global)

    //     // $scope.query1();
    //     $scope.stateflag= true;
    //     // console.log($scope.q1);
    // };    
    $scope.criteriaSelection = function(){
        // function records the selectedAge value(gloabl) within this controller 

        console.log($scope.selectedCriteria);
        $scope.ageflag= true;
        // $scope.$apply(function() {
            //console.log("I went into apply function");
            // $scope.states_info = states_info;
        $scope.selectedCriteriaflag= true;
        $scope.networkSelection();
        // })
        
        // $scope.stateflag= false;
        // if(map)
        // {
        //     console.log("deleting the map");
        //     map.dispose();
        // }

    };

    $scope.reloadfn = function()
    {
        if($scope.selectedCriteriaflag)
        {   localStorage.setItem('criteria',$scope.selectedCriteria);
            location.pathname = '/national';
            location.reload();
        $scope.selectedCriteriaflag= false}
    };

    $scope.mapdata = async function(){

        if(map)
        {
            console.log("in disposing");
            map.dispose();
        }
        var colordict ={}
        for (i = 1; i <= 51; i++) {
            if (i<=10)
                {colordict[i]='darkcyan'} 
            else if  (i>10 && i<=20)
            {colordict[i]='green'}
            else if (i>20 && i<=30)
            {colordict[i]='yellow'}
            else if (i>30 && i<=40)
            {colordict[i]='orange'}
            else if(i>40)
            {colordict[i]='red'}
    
        }
        var ranking_maps_data = {}
        var localcrit = $scope.selectedCriteria.Field;
        var fn = await (nationalService.ser_mapdata(localcrit).then(function(data){ranking_maps_data = data;}));
        var mydata = []
         for (var key in ranking_maps_data){
             var str1 = "US.";
             localcrit = localcrit.split(' ').join(''); 
             var temp = {"id":str1.concat(ranking_maps_data[key].State),"value":ranking_maps_data[key][localcrit]}
             mydata.push(temp);
         }
        console.log(mydata);
        $scope.$apply(function() {
            //console.log("I went into apply function");
            // $scope.states_info = states_info;
        $scope.mydata = mydata;})
        


        var map = anychart.map();

        var colorRange = map.colorRange();
        colorRange.enabled(true)
                .padding([20, 0, 0, 0])
                .colorLineSize(10)
                .stroke('#B9B9B9')
                .labels({'padding': 3})
                .labels({'size': 7});
        colorRange.ticks()
                .enabled(true)
                .stroke('#B9B9B9')
                .position('outside')
                .length(10);
        colorRange.minorTicks()
                .enabled(true)
                .stroke('#B9B9B9')
                .position('outside')
                .length(5);


        var dataSet = anychart.data.set(mydata);
        // create choropleth series
        series = map.choropleth(dataSet);
        
        series.colorScale(anychart.scales.linearColor('red', 'orange', 'yellow', 'green'));
        // set geoIdField to 'id', this field contains in geo data meta properties
        series.geoIdField('id');


        series.hovered().fill('#addd8e');

        // set geo data, you can find this map in our geo maps collection
        // https://cdn.anychart.com/#maps-collection
        map.geoData(anychart.maps['united_states_of_america']);

        //set map container id (div)
        map.container('container_map');
        map.draw();
       
        //initiate map drawing
        
        // map.dispose();
        
    }

    $scope.networkSelection = async function(){
        // function records the selectedState value (global)
 
        // $scope.query1();
        $scope.stateflag= true;
        // console.log($scope.q1);
        var states_info ={}
        var fn = await (nationalService.ser_stateinfo($scope.selectedState).then(function(data){states_info = data;}));

        var colordict ={}
        for (i = 1; i <= 51; i++) {
            if (i<=10)
                {colordict[i]='darkcyan'} 
            else if  (i>10 && i<=20)
            {colordict[i]='green'}
            else if (i>20 && i<=30)
            {colordict[i]='yellow'}
            else if (i>30 && i<=40)
            {colordict[i]='orange'}
            else if(i>40)
            {colordict[i]='red'}
    
        }
        for ( var key in states_info){
            // var tmp={}
            var rank_color = colordict[states_info[key].Ranks];
            states_info[key]['rank_color'] = rank_color;
            var nurse_rank_color = colordict[states_info[key].NursingHomeStaff];
            states_info[key]['nurse_rank_color'] = nurse_rank_color;
            var ahp_rank_color = colordict[states_info[key].AnnualHealthcarePremium];
            states_info[key]['ahp_rank_color'] = ahp_rank_color;
            var child_rank_color = colordict[states_info[key].ChildImmunization];
            states_info[key]['child_rank_color'] = child_rank_color;
            var doctor_rank_color = colordict[states_info[key].DoctorStaff];
            states_info[key]['doctor_rank_color'] = doctor_rank_color;
            var healthin_rank_color = colordict[states_info[key].HealthInsuranceCoverage];
            states_info[key]['healthin_rank_color'] = healthin_rank_color;
            var patientex_rank_color = colordict[states_info[key].InPatientExpense];
            states_info[key]['patientex_rank_color'] = patientex_rank_color;
            var infantsur_rank_color = colordict[states_info[key].InfantSurvival];
            states_info[key]['infantsur_rank_color'] = infantsur_rank_color;
            var selfrep_rank_color = colordict[states_info[key].SelfreportedHealthStatus];
            states_info[key]['selfrep_rank_color'] = selfrep_rank_color;

        }

        $scope.$apply(function() {
                //console.log("I went into apply function");
                $scope.states_info = states_info;})

        $scope.$apply(function() {
                //console.log("I went into apply function");
                $scope.mapdata();})
            //console.log($scope.states_info);

        
    };



    // $scope.getColumns = async function() {
    //     var columns = {};
    //     console.log($scope.selectedCriteria);
    //     var fn = await (nationalService.ser_columns().then(function(data){columns = data;}));
    //     $scope.$apply(function() {
    //             console.log("in getColumns");
    //             $scope.columns = columns;
    //         console.log($scope.columns);});
    //     console.log($scope.selectedCriteria);
    //     console.log($scope.columns);
    // };
    // $scope.ageSelection = function(){
    //     // function records the selectedAge value(gloabl) within this controller 
    //     console.log($scope.selectedState);
    //     $scope.ageflag= true;
    //     $scope.query1();
    //     console.log($scope.selectedAge);

    // };

 
    // $scope.GetDetails_Issuer = function (index) {
    //     // this function takes in the issuer id information from the get details button and uses that to run subsqeuent queries

    //     $scope.selectedIssuerID = $scope.q1[index].IssuerId;
    //     // console.log( $scope.selectedIssuerID)
    //     $scope.issuerflag= true;
    //     $scope.cont_avgrateperid($scope.avgrateperid);
    //     // $scope.cont_benefitperid();

    //     localStorage.setItem('issuerid', $scope.q1[index].IssuerId);
    //     window.open("/benefit");

    // };

//     $scope.GetDetails_Graph = async function (index) {
//         // function - takes the information from the  rate information displayed extracts them to scorp values (handling lag)
//         // invokes the create barchart function to get a graph 

//         $scope.avgrateperid_avgpremimum = $scope.avgrateperid[index].Avg_Premium;
//         $scope.avgrateperid_avgcopay = $scope.avgrateperid[index].Avg_Copay;
//         $scope.avgrateperid_avgcoins = $scope.avgrateperid[index].Avg_Coinsurance;

//         //Debug statement
//         console.log( $scope.q1[index])

//         //invoke graph function
//         $scope.createdg1flag= true;
//         $scope.createPieChart($scope);

//         // feed data in the card display first and then add a function within the calls 
//         console.log($scope.selectedIssuerID,$scope.selectedAge.Age)
        
//         // $scope.cont_metallevelrate();
//         console.log("About to enter feeddata")
//         var finish_metallevel = await ($scope.feeddata());

//         console.log(" Completed feeddata")

//         newsService.topSportsNews($scope.selectedState,$scope.topNewsLimit).then(function(data){$scope.topNews= data;});


//         // $scope.carddisplay();

//     };

//     $scope.createPieChart = function( $scope){
//             // handles the structure of the graph and the data passed through it 

//             // debug statements
//             console.log("In createPieChart");
//             console.log( $scope.avgrateperid_avgcopay)

//             //defintition of graph 
//             var data = {
//                 header: ["Name", "Number"],
//             rows: [
//                 ["Avg_Premium", $scope.avgrateperid_avgpremimum ],
//                 ["Avg_Copay", $scope.avgrateperid_avgcopay ],
//                 ["Avg_Coinsurance", $scope.avgrateperid_avgcoins]
//             ]};

//             // create the chart
//             var chart = anychart.pie(data);

//             // add data
//             //chart.data(data);

//             // set the chart title
//             chart.title("Data Visualization");


//             // draw
//             chart.container("piechartrates");
//             chart.draw();
//         };


//         // random test for cards
//         $scope.feeddata = async function(){
//             // var cont_metallevelrate =  function(){networkService.service_metallevelrate($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){$scope.metallevelrate = data;console.log("I got binded", $scope.metallevelrate);});};
//             var metaldata = {};
//             var carddata = []
//             var metallevelrate = await (networkService.service_metallevelrate($scope.selectedIssuerID,$scope.selectedAge.Age).then(function(data){metaldata =data;console.log(data);}));
                
//             // cont_metallevelrate().then(function(){console.log("I got binded", $scope.metallevelrate);});
//             // var waits = await $scope.cont_metallevelrate();
//             var colorpalet = { "High" :'IndianRed' , "Low":'beige', "Bronze":'Peru', "Silver":'silver',"Catastrophic":'darkcyan','Gold':'DarkGoldenRod'};
//             // console.log(metaldata);
//             // console.log("For loop");
//             // iterate through the metaldata to get info on card 
//             for ( var key in metaldata){
//                 var tmp={}
//                 tmp['level'] = metaldata[key].MetalLevel;
//                 metaldata[key]['color'] = colorpalet[metaldata[key].MetalLevel];
                
//                 // tmp['premium'] = metaldata[key].premium;
//                 // tmp['avgcopay1'] = metaldata[key].AvgCopayInTier1;
//                 // tmp['avgcopaynet']= metaldata[key].AvgCopayOutofNet;
//                 // tmp['avgcoins1']= metaldata[key].AvgCoinsInTier1;
//                 // tmp['avgcoinsnet']= metaldata[key].AvgCoinsOutofNet;
//                 // carddata.push(tmp);
//             }
//             // // console.log(metaldata);
//             // console.log(carddata)
//             $scope.$apply(function() {
//                 console.log("I went into apply function");
//                 $scope.sensorList = metaldata;})

//             console.log($scope.sensorList);


//         };
                
//     $scope.Get_metalgraphs = function(value){
//         console.log(value);
//         var data = {
//             header: ["Name", "Number"],
//         rows: [
//             ["Premium", value.premium ],
//             ["Avg Copay", value.AvgCopayInTier1 ],
//             ["Avg Coinsurance", value.AvgCoinsInTier1],
//             ["Avg Copay Out of Net", value.AvgCopayOutofNet ],
//             ["Avg Coinsurance Out of Net", value.AvgCoinsOutofNet ],

//         ]};

//         // create the chart
//         var chart = anychart.pie(data);

//         // add data
//         //chart.data(data);
//         chart.radius('43%')
//         chart.innerRadius('30%');
//         //set chart radius
//         // create empty area in pie chart
        
//         // set the chart title
//         chart.title("Rates Visualization");


//         // draw
//         chart.container("donughtchartrates".concat(value.MetalLevel));
//         chart.draw();

//     };
//     // $scope.carddisplay= function() {
//             //     $scope.sensorList = [{
//             //     hour: 12,
//             //     color: 'red'
//             //     }, {
//             //     hour: 12,
//             //     color: 'green'
//             //     }, {
//             //     hour: 12,
//             //     color: '#a3a3a3'
//             //     }, {
//             //     hour: 5,
//             //     color: 'purple'
//             //     }, {
//             //     hour: 2,
//             //     color: '#b68585'
//             //     }, {
//             //     hour: 12,
//             //     color: '#d2d2d2'
//             //     }, {
//             //     hour: 12,
//             //     color: '#c77cdf'
//             //     // }, {
//             //     // hour: 3,
//             //     // color: '#b68585'
//             //     // }, {
//             //     // hour: 14,
//             //     // color: 'yellow'
//             //     // }, {
//             //     // hour: 4,
//             //     // color: 'blue'
//             //     // }, {
//             //     // hour: 7,
//             //     // color: '#aeaeae'
//             //     // }, {
//             //     // hour: 12,
//             //     // color: '#d4d6d7'
//             //     }];
//             // }
// ////////////////////////////////if needed use these//////////////////////////////////////
       
//     // $scope.q1Selection = function(){
//     // 	$scope.query1();
//     //     console.log($scope.q1);
//     //     $scope.cont_avgrateperid();
//     //     console.log($scope.avgrateperid);
//     // };

//     // $scope.cont_avgrateperidSelection = function(){
//     //     // $scope.issuerflag= true;

//     //     // console.log($scope.selectedIssuerID.IssuerId);
//     //     $scope.cont_avgrateperid();

//     //     // $scope.chart1data = [$scope.avgrateperid.Avg_Premium, $scope.avgrateperid.Avg_Copay,$scope.avgrateperid.Avg_Coinsurance];
//     //     $scope.cont_benefitperid();
//     //     // console.log($scope.avgrateperid);
//     //     if (typeof $scope.avgrateperid !== 'undefined')
//     //         {$scope.chart1data = [$scope.avgrateperid.Avg_Premium, $scope.avgrateperid.Avg_Copay,$scope.avgrateperid.Avg_Coinsurance];}
//     //     else
        
//     //         {$scope.chart1data = [10, 35,45];}
//     //     console.log($scope.chart1data);
//     //     };

});
