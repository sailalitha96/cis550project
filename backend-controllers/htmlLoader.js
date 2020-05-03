var path = require('path');

var view_path = path.join(__dirname, '../', 'views');

/*---------------------------------------------------Intro----------------------------------------------------*/
exports.intro = function(req, res, next) {  
    res.sendFile( view_path +'/intro.html');
};


/*---------------------------------------------------Home----------------------------------------------------*/
exports.home = function(req, res, next) {  
    res.sendFile( view_path +'/home.html');
};


/*---------------------------------------------------Stats----------------------------------------------------*/


/*---------------------------------------------------Stats----------------------------------------------------*/





/*---------------------------------------------------Reults----------------------------------------------------*/



/*---------------------------------------------------Reults----------------------------------------------------*/
exports.navBar = function(req, res, next) {  
    res.sendFile( view_path +'/navBar.html');
};



/*---------------------------------------------------Reults----------------------------------------------------*/


/*---------------------------------------------------Network---------------------------------------------------*/
exports.network = function(req, res, next) {  
    res.sendFile( view_path +'/network.html');
};

exports.dental = function(req, res, next) {  
    res.sendFile( view_path +'/dental.html');
};

exports.benefit = function(req, res, next) {  
    res.sendFile( view_path +'/benefit.html');
};
