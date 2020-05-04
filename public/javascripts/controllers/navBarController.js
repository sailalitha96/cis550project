app.controller("navBarController",navbarController = function navbarController($scope,userInfoService) {

  //----------------------------------------------Page view configurations------------------------------------------------
    
    $scope.homePage = '/home';
    $scope.networkPage = '/network';
    $scope.dentalPage = '/dental';
    $scope.benefitPage = '/benefit';
    $scope.nationalPage = '/national';


    //----------------------------------------------Get Data From the services(Create chart for countries)------------------------------------------------

    userInfoService.getInfo().then(function(data){$scope.user= data;}); 
    console.log($scope.user)
    // create a service which feeds the 
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
