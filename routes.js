const { Db } = require('mongodb');

module.exports = function(app, db) {
   
    require('./server/service/user')(app, db);
    require('./server/service/category')(app, db);
    require('./server/service/subcategory')(app, db);
    require('./server/service/country')(app, db);
    require('./server/service/state')(app, db);
    require('./server/service/city')(app, db);



};