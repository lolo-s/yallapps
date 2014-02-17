/**********************************************************/
/* Used to retreive DB connection information             */
/**********************************************************/
var common = require('./appServiceDbConnect');

/*********************************************************************/
/* Constants -                                                       */
/* The constants below are responses from the server for quries.     */
/* They are used by the application in order to understnad qureis'   */
/* responses.                                                        */
/*********************************************************************/
var Constants = {
    USER_LOGIN_SUCCESS: 'A00',
    USER_LOGOUT_SUCCESS: 'A01',
    USER_SIGNIN_SUCCESS: 'A02',
    USER_NOT_EXIST: 'A03',
    USER_DISPLAY_NAME_NOT_EXIST: 'A04',
    USER_LOGIN_FAILD: 'E00',
    USER_LOGOUT_FAILD: 'E01',
    USER_EXIST: 'E02',
    USER_SIGNIN_FAILED: 'E03',
    USER_DISPLAY_NAME_EXIST: 'E04'
};

/*********************************************************************/
/* getUserByEmail -                                          */
/* This function return user details by given email.                 */
/* get method.                                                       */
/*********************************************************************/
exports.getUserByEmail = function (req, res) {
    console.log("getUserByEmail - In");

    var usersCollection = common.getUsersCollectionName();
    var appServiceDB = common.getDBConnection();
    var email = req.params.email;
    if (email) {
        console.log('Retrieving user details by given email: ' + email);
        appServiceDB.collection(usersCollection, function (err, collection) {
            collection.findOne({
                'Email': email
            }, function (error, item) {
                res.setHeader("Content-Type", "text/plain");
                console.log("error = " + error);
                console.log("item = " + item);
                res.send(item);
            });
        });
    }
    console.log("getUserByEmail - Out");
}

/*********************************************************************/
/* getAllUsers -                                             */
/* This function return all the users that stored on the db.         */
/* get method.                                                       */
/*********************************************************************/
exports.getAllUsers = function (req, res) {
    console.log("getAllUsers - In");
    var usersCollection = common.getUsersCollectionName();
    var appServiceDB = common.getDBConnection();
    console.log('Retrieving All users');
    appServiceDB.collection(usersCollection, function (err, collection) {
        collection.find().toArray(function (error, items) {
            res.setHeader("Content-Type", "text/plain");
            console.log("error = " + error);
            console.log("items = " + items);
            res.send(items);
        });
    });
    console.log("getAllUsers - Out");
}

/*********************************************************************/
/* userLogIn -                                                   */
/* This function make user login to the system by user credentials.  */
/* If the user credentials are not authenticate than the             */
/* function will not change the user ConnectionStatus.               */
/* The function send API messages respectively.                      */
/* get method.                                                       */
/*********************************************************************/
exports.userLogIn = function (req, res) {
    console.log("userLogIn - In");
    var usersCollection = common.getUsersCollectionName();
    var appServiceDB = common.getDBConnection();
    var email = req.params.email;
    var password = req.params.password;
    console.log("email: " + email);
    console.log("password: " + password);
    if (email && password) {
        console.log('userLogIn - email & password not null');
        appServiceDB.collection(usersCollection, function (err, collection) {
            collection.findOne({
                    'Email': email,
                    'Password': password
                }, {
                    'FirstName': true,
                    'Password': true,
                    '_id': false
                },
                function (error, item) {
                    //User credentials are correct => user ConnectionStatus will update to Online.
                    if (item) {
                        console.log("User was found in the db.");
                        collection.update({
                            'Email': email
                        }, {
                            $set: {
                                'ConnectionStatus': "Online"
                            }
                        }, {
                            safe: true
                        }, function (updateErr, updateres) {
                            if (updateErr) {
                                console.log("Error updating users Online: " + updateErr);
                                res.send({
                                    "error": "An error has occurred"
                                });
                            } else {
                                console.log("The ConnectionStatus was update to Online. res: " + updateres);
                                console.log("res msg will be send: " + Constants.USER_LOGIN_SUCCESS);
                                res.setHeader("Content-Type", "text/plain");
                                res.send(JSON.stringify(Constants.USER_LOGIN_SUCCESS));
                            }
                        });
                    } else {
                        console.log("User was NOT found in the db.");
                        console.log("res msg will be send: " + Constants.USER_LOGIN_FAILD);
                        res.setHeader("Content-Type", "text/plain");
                        res.send(JSON.stringify(Constants.USER_LOGIN_FAILD));
                    }
                });
        });
    }

    console.log("userLogIn - Out");
}

/*********************************************************************/
/* isUserExist -                                             */
/* This function make a user registration.                           */
/* get method.                                                       */
/*********************************************************************/
exports.isUserExist = function (req, res) {
    console.log("isUserExist - In");
    var usersCollection = common.getUsersCollectionName();
    var appServiceDB = common.getDBConnection();
    var email = req.params.email;

    if (email) {
        console.log('Check if user Email exist: ' + email);
        appServiceDB.collection(usersCollection, function (err, collection) {
            collection.findOne({'Email': email}, function (error, item) {
                if (item) { //user exist.
                    console.log("User already Exist in the db.");
                    console.log("res msg will be send: " + Constants.USER_EXIST);
                    res.setHeader("Content-Type", "text/plain");
                    res.send(JSON.stringify(Constants.USER_EXIST));
                } else {
                    console.log("User not Exist in the db.");
                    console.log("res msg will be send: " + Constants.USER_NOT_EXIST);
                    res.setHeader("Content-Type", "text/plain");
                    res.send(JSON.stringify(Constants.USER_NOT_EXIST));
                }
            });
        });
    }
    console.log("isUserExist - Out");
}

/*********************************************************************/
/* isDisplayNameExist -                                      */
/* This function make a user registration.                           */
/* get method.                                                       */
/*********************************************************************/
exports.isDisplayNameExist = function (req, res) {
    console.log("isDisplayNameExist - In");
    var usersCollection = common.getUsersCollectionName();
    var appServiceDB = common.getDBConnection();
    var displayName = req.params.displayName;

    if (displayName) {
        console.log('Check if user displayName exist: ' + displayName);
        appServiceDB.collection(usersCollection, function (err, collection) {
            collection.findOne({'DisplayName': displayName}, function (error, item) {
                if (item) { //user exist.
                    console.log("User DisplayName already Exist in the db.");
                    console.log("res msg will be send: " + Constants.USER_DISPLAY_NAME_EXIST);
                    res.setHeader("Content-Type", "text/plain");
                    res.send(JSON.stringify(Constants.USER_DISPLAY_NAME_EXIST));
                } else {
                    console.log("User DisplayName not Exist in the db.");
                    console.log("res msg will be send: " + Constants.USER_DISPLAY_NAME_NOT_EXIST);
                    res.setHeader("Content-Type", "text/plain");
                    res.send(JSON.stringify(Constants.USER_DISPLAY_NAME_NOT_EXIST));
                }
            });
        });
    }
    console.log("isDisplayNameExist - Out");
}

/*********************************************************************/
/* insertUser -                                                  */
/* This function make a user registration.                           */
/* post method.                                                      */
/* Assumption: The User (email) does not exist in the db.            */
/*********************************************************************/
exports.insertUser = function (req, res) {
    console.log("insertUser - In");
    var usersCollection = common.getUsersCollectionName();
    var appServiceDB = common.getDBConnection();
    var user = req.body;
    console.log("User: \n" + user);

    appServiceDB.collection(usersCollection, function (err, collection) {
        collection.insert(user, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('result: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
    console.log("insertUser - Out");
}

/*********************************************************************/
/* deleteUser -                                              */
/* This function delete user from the db by given id.                */
/* delete method                                                     */
/*********************************************************************/
exports.deleteUser = function (request, result) {
    console.log("FollowMeDeleteUser - In");
    var usersCollection = common.getUsersCollectionName();
    var appServiceDB = common.getDBConnection();
    var email = request.params.email;

    console.log('FollowMeDeleteUser - Deleting user by given email: ' + email);
    appServiceDB.collection(usersCollection, function (err, collection) {
        collection.remove({'Email': email}, { safe: true},
        function (err, res) {
            if (err) {
                result.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                console.log('deleteUser - ' + res + ' document(s) deleted');
                result.send(request.body);
            }
        });
    });
    console.log("deleteUser - Out");
}