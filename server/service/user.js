module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../config/config');
    const common = require('../globel/common');
    const USERMODELS = require('../models/user-model');
    const USERREPORT  = require('../models/user-report');
    const arryEmpty =[];
    /*
    TODO:This api use Save User details in Data Base
    @Function: Save user details Data
    */

    app.post('/rental/registration', (req,res) =>  { 
        try{
             var obj = req.body;
             var strActionType ="SAVE";
             
             if(common.isEmptyObject(obj)) {    
                 res.status(200).json({success: false, message: 'Params missing', data:arryEmpty});    
             } else { 
                 USERMODELS.funRegisterUserDetails(obj,db).then(( result )=>{
                     if(result && result.success === true) {
                         res.status(200).json(result)
                     } else {
                         res.status(200).json(result)
                     }
                 });
             }
         } catch (e) {
             console.log("Error",e);
             res.status(500).json({success: false, message: "Error:"+e, data:arryEmpty});
         }
 
     });
 
}