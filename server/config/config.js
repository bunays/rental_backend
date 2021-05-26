module.exports = {

///'mongo ds359847.mlab.com:59847/publiqfigure_db -u admin -p @dmin123'
//mongodb+srv://admin:<password>@po4-05cug.mongodb.net/test?retryWrites=true&w=majority

DATABASE_NAME :"db_rental",
CONNECTION_URL: "mongodb+srv://jam:jam@123@cluster0-p9jn3.mongodb.net/test?retryWrites=true&w=majority",

    //DATABASE_NAME :"db_rental",
    //CONNECTION_URL: "mongodb+srv://Lapslock:Lapslock23@clusterlplk.ekakv.mongodb.net/pms_backend?retryWrites=true&w=majority",
    //'mongodb://localhost:27017/',
   
    //  imagePath:'https://lapslock.com',
    //imagePath:'http://68.183.85.146:9000',
    //imagePath:'http://localhost:9000',
    

    USER_DEVICES_COLLECTION:'cln_user_devices',
    USER_COLLECTION : 'cln_user',

    CATEGORY_COLLECTION : 'cln_category',
    SUBCATEGORY_COLLECTION : 'cln_subcategory',
    COUNTRY_COLLECTION:'cln_country',
    CITY_COLLECTION:'cln_city',
    STATE_COLLECTION:'cln_state',

    JWT_SECRET: 'p04$&S()*2'

    

};