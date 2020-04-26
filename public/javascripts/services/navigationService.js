app.factory('navigationService',function($window){

    var navigateToSport = function(sport) {
        $window.location.href = `/olympicSports?sport=${sport}`;
    };

    return {
        navigateToSport: navigateToSport
    };
});