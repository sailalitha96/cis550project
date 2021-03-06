app.controller('homeController', function($scope, networkService) {

    //----------------------------------------------Page view configurations------------------------------------------------
	$scope.stateid = "";


    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    //Get the sport data in the $scope.sport variable
    //sportsService.sportsList().then(function(data){$scope.sports= data;}); 
    



//----------------------------------------------Get Data From the services------------------------------------------------
    
    //console.log($scope.sport);

//----------------------------------------------Redirect to page------------------------------------------------
    //$scope.navigateToSport = navigationService.navigateToSport;
// $scope.anychart.onDocumentReady(function () {
//     console.log("IN here");
// 	// set chart theme
//     anychart.theme("lightBlue");
// });

$scope.loaddata = function() {
  // create map
  anychart.theme('darkBlue');
  var map = anychart.map();
  
  // create data set


  var dataSet = anychart.data.set(
      [{"id":"US.MA","value":0},
      {"id":"US.MN","value":1},
      {"id":"US.MT","value":2},
      {"id":"US.ND","value":3},
      {"id":"US.HI","value":4},
      {"id":"US.ID","value":5},
      {"id":"US.WA","value":6},
      {"id":"US.AZ","value":7},
      {"id":"US.CA","value":8},
      {"id":"US.CO","value":9},
      {"id":"US.NV","value":10},
      {"id":"US.NM","value":11},
      {"id":"US.OR","value":12},
      {"id":"US.UT","value":13},
      {"id":"US.WY","value":14},
      {"id":"US.AR","value":15},
      {"id":"US.IA","value":16},
      {"id":"US.KS","value":17},
      {"id":"US.MO","value":18},
      {"id":"US.NE","value":19},
      {"id":"US.OK","value":20},
      {"id":"US.SD","value":21},
      {"id":"US.LA","value":22},
      {"id":"US.TX","value":23},
      {"id":"US.CT","value":24},
      {"id":"US.NH","value":25},
      {"id":"US.RI","value":26},
      {"id":"US.VT","value":27},
      {"id":"US.AL","value":28},
      {"id":"US.FL","value":29},
      {"id":"US.GA","value":30},
      {"id":"US.MS","value":31},
      {"id":"US.SC","value":32},
      {"id":"US.IL","value":33},
      {"id":"US.IN","value":34},
      {"id":"US.KY","value":35},
      {"id":"US.NC","value":36},
      {"id":"US.OH","value":37},
      {"id":"US.TN","value":38},
      {"id":"US.VA","value":39},
      {"id":"US.WI","value":40},
      {"id":"US.WV","value":41},
      {"id":"US.DE","value":42},
      {"id":"US.MD","value":43},
      {"id":"US.NJ","value":44},
      {"id":"US.NY","value":45},
      {"id":"US.PA","value":46},
      {"id":"US.ME","value":47},
      {"id":"US.MI","value":48},
      {"id":"US.AK","value":49},
      {"id":"US.DC","value":50}]
  );

  // create choropleth series
  series = map.choropleth(dataSet);

  // set geoIdField to 'id', this field contains in geo data meta properties
  series.geoIdField('id');

  // set map color settings
  series.colorScale(anychart.scales.linearColor('#bf5c4e','#a35a2c', '#c96e06', '#dbaa48', 'beige'));

//   series.background().enabled(true);
  series.hovered().fill('#addd8e');
  
//   series.background().fill('#3182bd');

  // set geo data, you can find this map in our geo maps collection
  // https://cdn.anychart.com/#maps-collection
  map.geoData(anychart.maps['united_states_of_america']);

  //set map container id (div)
  map.interactivity().zoomOnMouseWheel(true);
  map.container('container_map');

  //initiate map drawing
  map.draw();

  map.listen('pointClick', function (evt) {
        var point = evt.point;
        var id = point.get('id');
        var id = id.split('.')[1];
        // networkService.addState(id);
        $scope.stateid = id;
        localStorage.setItem('state', id);
        window.open("/network");
      });

};


$scope.loaddata();



// now need to create a bar chart based on highest saving In us 
$scope.statesavings = function(){
    console.log("In bar function");

    var colorIndex = 0;
    var color1 = "#FF0000";
    // color darken function
          function colorizer(){
              
              var mixColor1 = anychart.color.darken(color1, colorIndex);
              colorIndex = colorIndex + 0.2;
              return mixColor1;
          }
    
    // data and fill color settings
    var data = [
      {x:"MD" ,value:72403 , fill: (colorizer())},
      {x:"NJ" ,value:69327, fill: (colorizer())},
      {x:"MA",value: 68922, fill: (colorizer())},
      {x:"HI",value:68470, fill: (colorizer())},
      {x:"AK",value:64252, fill: (colorizer())}];

   

    // create the chart
    var dataSet = anychart.data.set(data);
    var chart = anychart.column();
    var series = chart.column(data);
    var background = chart.background();
    background.fill({
    // set colors position
    // keys: ["rgba(183, 180, 173)", "rgba(108, 106, 100)"],
    keys: ["#e8b66b", "rgba(105, 83, 23) "],
    // set angle of colors drawing
    angle: -130
    });
    // add data
    //chart.data(data);

    // set the chart title
    chart.title("Top 5 States with Maximum Medical Savings");


    // draw
    chart.container("barchartsaving");
    chart.draw();

};

$scope.statesavings();

$scope.homepiechart = function(){

    var colorIndex = 0;
    var color1 = "#FF0000";
    // color darken function
          function colorizer(){
              
              var mixColor1 = anychart.color.darken(color1, colorIndex);
              colorIndex = colorIndex + 0.2;
              return mixColor1;
          }

    var data = {
        header: ["Name", "Number"],
    rows: [
        ["Male", 45011.2 ],
        ["Female", 32176.2],
        // ["Avg_Coinsurance", $scope.avgrateperid_avgcoins]
    ]};

    // create the chart
    var chart = anychart.pie(data);
    var background = chart.background();
    // background.fill({
    // // set colors position
    // keys: ["rgb(207, 165, 72)", "rgb(239, 138, 138)"],
    // // set angle of colors drawing
    // angle: -130
    // });
    // add data
    //chart.data(data);
    chart.background().enabled(true);
    chart.background().fill("#ffd54f 0.2");
    // set the chart title
    chart.title("Total No of Deaths in US - Based on Gender");


    // draw
    chart.container("homepiechart");
    chart.draw();
};

$scope.homepiechart();

$scope.top5covid = function(){
var colorIndex = 0;
    var color1 = "#C71585";
    // color darken function
          function colorizer(){
              var mixColor1 = anychart.color.darken(color1, colorIndex);
              colorIndex = colorIndex + 0.2;
              return mixColor1;
          }
    // data and fill color settings
    var data = [
      {x:"NY" ,value:318953 , fill: (colorizer())},
      {x:"NJ" ,value:128269, fill: (colorizer())},
      {x:"MA",value: 69087, fill: (colorizer())},
      {x:"IL",value:63777, fill: (colorizer())},
      {x:"CA",value:55658, fill: (colorizer())}];
    // create the chart
    var dataSet = anychart.data.set(data);
    var chart = anychart.column();
    var series = chart.column(data);
    var background = chart.background();
    background.fill({
    // set colors position
    keys: ["#e8b66b", "rgba(105, 83, 23) "],
    // set angle of colors drawing
    angle: -130
    });
    // add data
    //chart.data(data);
    // set the chart title
    chart.title("Top 5 States with Maximum COVID Cases");
    // draw
    chart.container("barchartcovid");
    chart.draw();
};

$scope.top5covid();
});
