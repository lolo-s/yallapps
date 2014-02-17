var usersCollection = "users";
var dataBaseName = "appService";

/* Database Connection */
var appServiceDB = null;

/* Access to MongoDB package */
var mongo = require('mongodb');

/* We enter this code only once */
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
} else {
    var mongo = {
        "hostname": "localhost",
        "port": 27017,
        "username": "",
        "password": "",
        "name": "",
        "db": "appServiceDB"
    }
}

var generate_mongo_url = function (obj) {
    /*init connection params */
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');

    if (obj.username && obj.password) {
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    } else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}

var mongourl = generate_mongo_url(mongo);

require('mongodb').connect(mongourl, function (err,conn) {
    appServiceDB = conn;
    if (err == null) {
        console.log("Connected to " + dataBaseName + " database");
        appServiceDB.collection(usersCollection, { strict: true }, function (err, collection) {
            if (err) {
                console.log("The '" + usersCollection + "' collection doesn't exist. Creating it with sample data...");
                populateAppServiceDB(usersCollection);
            }
        });
    }
});

exports.getDBConnection = function () {
    console.log("GetDBConnection - In");
    return appServiceDB;
}

exports.getUsersCollectionName = function () {
    console.log("GetUsersCollectionName - In");
    return usersCollection;
}



/* FollowME Maintanance Utils - END */
var populateAppServiceDB = function (collectionName) {
    if (collectionName == usersCollection) {
        insertSampleUsers();
    }
};

var insertSampleUsers = function () {
    for (var index = 0; index < sampleUsers.length; index++) {
        appServiceDB.collection(usersCollection, function (err, collection) {
            collection.insert(sampleUsers[index], { safe: true },
            function (err, result) {
                console.log("User result=" + result);
                console.log("err=" + err);
            });
        });
    }
}
/* appService Maintanance Utils - END */


/* Sample Data */
var sampleUsers = [{
    
}]
/* Sample Data - END*/