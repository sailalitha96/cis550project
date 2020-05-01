app.controller("navBarController",navbarController = function navbarController($scope,userInfoService) {

  //----------------------------------------------Page view configurations------------------------------------------------
    
    $scope.homePage = '/home';
    $scope.networkPage = '/network';
    $scope.dentalPage = '/dental';



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
