var mongoUtil = require('../mongoUtil.js');

exports.getList = function(req, res) {
    var username = req.params.username;
    var useremail = req.params.useremail;

    mongoUtil.connectToServer( function( err, client ) {
    if (err) console.log(err);
    else{
        var dbo = client.db("mydb");
        db.collection('Information', function (err, collection)
        {
            // do inserts 
            collection.insert({ user_name: username, user_emailid: useremail });
            console.log("Inserted");

        }
        
        )}

    })

};

    


           


