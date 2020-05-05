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
    

    // given the state return the things for various headers.
    nationalService.cont_stateinfo = function(){nationalService.ser_stateinfo($scope.selectedState).then(function(data){$scope.states_info = data;});};
    nationalService.ser_columns().then(function(data){$scope.agelists = data;});
//----------------------------------------------Get Data From the services------------------------------------------------
   
    $scope.criteriaSelection = function(){
        // function records the selectedAge value(gloabl) within this controller 

        console.log($scope.selectedCriteria);
        $scope.selectedCriterianame = $scope.selectedCriteria.Field;
        $scope.ageflag= true;
       
        $scope.selectedCriteriaflag= true;
        $scope.networkSelection();
     
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
        // feeding data into the map 
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
        
        series.colorScale(anychart.scales.linearColor('#d13a2c','#c75416', '#e0ba22', '#bdbd24', '#8eb360'));
        // set geoIdField to 'id', this field contains in geo data meta properties
        series.geoIdField('id');


        series.hovered().fill('#addd8e');

        // set geo data, you can find this map in our geo maps collection
        // https://cdn.anychart.com/#maps-collection
        map.geoData(anychart.maps['united_states_of_america']);

        //set map container id (div)
        map.container('container_map');
        map.draw();
       
    
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
                $scope.states_info = states_info;})

        $scope.$apply(function() {
                //console.log("I went into apply function");
                $scope.mapdata();})

        
    };



});
