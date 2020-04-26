app.controller("navBarController",navbarController = function navbarController($scope,userInfoService) {

  //----------------------------------------------Page view configurations------------------------------------------------
    
    var defaultSport = 'BasketBall';
    $scope.homePage = '/home';
    $scope.sportsPage = `/olympicSports?sport=${defaultSport}`;
    $scope.resultsPage = '/results';
    $scope.statsPage = '/stats';
    $scope.quizPage = '/quiz';
    $scope.networkPage = '/network';



    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    userInfoService.getInfo().then(function(data){$scope.user= data;}); 
    
});





app.directive("navbar",function(){
    console.log("Hello");
    return {
      restrict:'E',
      scope : {
        page:'='
      },
      controller: navbarController, 
      templateUrl:'navBar'
    };
});
