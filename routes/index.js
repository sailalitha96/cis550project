var express = require('express');
var router = express.Router();



/* Controllers */

var htmlLoader = require('../backend-controllers/htmlLoader.js');
var authController = require('../backend-controllers/authentication');
var networkController = require('../backend-controllers/network.js');



/* ----------------------------------------------------Load HTML pages ----------------------------------------------------*/
//Note: Add authController.secured is a miidle ware. Add it to pages which you want to
//provide access only when a user is logged in.

router.get('/', htmlLoader.intro);
router.get('/intro', htmlLoader.intro);
router.get('/home', authController.secured, htmlLoader.home);

router.get('/navBar', htmlLoader.navBar);
router.get('/network',htmlLoader.network);


router.get('/network_backend_states/', networkController.getList);
router.get('/network_backend_ages/', networkController.getagedistinct);
router.get('/network_backend_q1/state/', networkController.q1list);

/* ---------------------------------------------------- Authentication ----------------------------------------------------*/

router.get('/login',authController.loginAuth,authController.loginRedirect);
router.get('/callback',authController.callback);
router.get('/logout',authController.logOut);
router.get('/userInfo',authController.secured,authController.userInfo);










module.exports = router;
