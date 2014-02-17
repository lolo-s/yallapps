/* Connection configuration */
var express = require('express');
var appServiceDBConnect = require('./appServiceDbConnect');
var appServiceAPI = require('./appServiceAPI');

var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

/* Express instantiation */
var app = express();
app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

/* linking methods to REST methods */

/* GETs */
app.get('/users/getuser/:email', appServiceAPI.getUserByEmail);
app.get('/users/getall/', appServiceAPI.getAllUsers);
app.get('/users/login/:email/:password', appServiceAPI.userLogIn);
app.get('/users/userexist/:email', appServiceAPI.isUserExist);
app.get('/users/displaynameexist/:displayName', appServiceAPI.isDisplayNameExist);
/* POSTs */
//app.post('/users/changeuserstate/:email', appServiceAPI.changeUserState);
app.post('/users/insertuser/', appServiceAPI.insertUser);
/* DELETEs */
app.delete('/users/deleteuser/:email', appServiceAPI.deleteUser);

app.listen(port, host);