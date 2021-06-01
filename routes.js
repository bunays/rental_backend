const { Db } = require('mongodb');

module.exports = function(app, db) {
   
    require('./server/service/admin/user')(app, db);
    require('./server/service/admin/category')(app, db);
    require('./server/service/admin/subcategory')(app, db);
    require('./server/service/admin/country')(app, db);
    require('./server/service/admin/state')(app, db);
    require('./server/service/admin/city')(app, db);
    require('./server/service/admin/product')(app, db);
    require('./server/service/admin/booking')(app, db);

    require('./server/service/rental/forgotten_password')(app, db);
    require('./server/service/rental/product')(app, db);
    require('./server/service/rental/booking')(app, db);


    require('./server/service/upload/upload')(app, db);



};