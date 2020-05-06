module.exports = function () {
    return function (req, res, next) {
      // console.log("in middleware");
      res.locals.user = req.user;
      
      next();
   
}};
