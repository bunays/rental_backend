const { Db } = require('mongodb');

module.exports = function(app, db) {
   
    require('./server/service/user')(app, db);
};