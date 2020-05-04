var express = require('express');
var router = express.Router();



/* Controllers */

var htmlLoader = require('../backend-controllers/htmlLoader.js');
var authController = require('../backend-controllers/authentication');
var networkController = require('../backend-controllers/network.js');
var dentalController = require('../backend-controllers/dental.js');
var benefitController = require('../backend-controllers/benefit.js');
var nationalController = require('../backend-controllers/national.js');





/* ----------------------------------------------------Load HTML pages ----------------------------------------------------*/
//Note: Add authController.secured is a miidle ware. Add it to pages which you want to
//provide access only when a user is logged in.

router.get('/', htmlLoader.intro);
router.get('/intro', htmlLoader.intro);
router.get('/home', authController.secured, htmlLoader.home);

router.get('/navBar', htmlLoader.navBar);
router.get('/network',htmlLoader.network);
router.get('/dental',htmlLoader.dental);
router.get('/benefit',htmlLoader.benefit);
router.get('/national' ,htmlLoader.national);
router.get('/info', htmlLoader.info);



router.get('/login',authController.loginAuth,authController.loginRedirect);
router.get('/callback',authController.callback);
router.get('/logout',authController.logOut);
router.get('/userInfo',authController.secured,authController.userInfo);

/* ------------------------------------------------------ Network ------------------------------------------------------*/


router.get('/network_backend_states/', networkController.getList);
router.get('/network_backend_ages/', networkController.getagedistinct);
router.get('/network_backend_q1/state/', networkController.q1list);
router.get('/network_backend_avgrate/issuerid/:issuerid/age/:age', networkController.getAvgratescopay);
router.get('/network_backend_benefitname/issuerid/:issuerid/age/:age', networkController.getbenefitname);
router.get('/network_backend_metalrate/issuerid/:issuerid/age/:age', networkController.getmetallevelrates);

/* ------------------------------------------------------ Dental ------------------------------------------------------*/


router.get('/dental_backend_states/', dentalController.getList);
router.get('/dental_backend_ages/', dentalController.getagedistinct);
router.get('/dental_backend_q1/state/', dentalController.q1list);
router.get('/dental_backend_avgrate/issuerid/:issuerid/age/:age', dentalController.getAvgratescopay);
router.get('/dental_backend_benefitname/issuerid/:issuerid/age/:age', dentalController.getbenefitname);
router.get('/dental_backend_metalrate/issuerid/:issuerid/age/:age', dentalController.getmetallevelrates);


/* ---------------------------------------------------- Benefits ----------------------------------------------------*/


router.get('/benefit_backend_benefitname/issuerid/:issuerid/age/:age', benefitController.getbenefitname);
/* ---------------------------------------------------- National  ----------------------------------------------------*/


router.get('/national_backend_rankings/',nationalController.nat_getList);
router.get('/national_backend_stateinfo/state/',nationalController.nat_stateinfo);
router.get('/national_backend_columns/columns',nationalController.nat_columns);
router.get('/national_backend_mapdata/crit/',nationalController.nat_mapdata);












module.exports = router;
