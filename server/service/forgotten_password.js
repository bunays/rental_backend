module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../config/config');
    const common = require('../globel/common');
    const FORGOTTEN_PASSWORDMODELS = require('../models/forgotten_password-model');
    const arryEmpty =[];

   
    /*
    TODO:This api use to update password details in Data Base
    @Function: to update password  details Data
    */

    app.post('/api/auth/forgotUserPassword', (req,res) =>  { 

        try{
            var obj = req.body;
            var strActionType ="SAVE";
            if(common.isEmptyObject(obj)) {    
                res.status(200).json({success: false, message: 'Params missing', data:arryEmpty});    
            } else { 
                // BANKMODELS.funValidateBankUpdateDetails(strActionType,req,db).then(( result )=>{
                //     if(result && result.success === true) {
                    FORGOTTEN_PASSWORDMODELS.funForgottenPasswordUpdateDetails(obj,db).then(( result )=>{
                        if(result && result.success === true) {
                            res.status(200).json(result)
                            } else {
                                res.status(200).json(result)
                            }
                    });
                //     } else {
                //         res.status(200).json(result)
                //     }
                // });          
            }
         } catch (e) {
             console.log("Error",e);
             res.status(500).json({success: false, message: "Error:"+e, data:arryEmpty});
         }
 
    });

    /*
    TODO:This api use to reset password details in Data Base
    @Function: to reset password  details Data
    */

    app.post('/api/auth/reset_password', (req,res) =>  { 
        try{
            var obj = req.body;
            var strActionType ="SAVE";
            
            if(common.isEmptyObject(obj)) {    
                res.status(200).json({success: false, message: 'Params missing', data:arryEmpty});    
            } else { 
                // FORGOTTEN_PASSWORDMODELS.funValidateResetPasswordDetails(strActionType,req,db).then(( result )=>{
                //     if(result && result.success === true) {
                    FORGOTTEN_PASSWORDMODELS.funResetPasswordUpdateDetails(obj,db).then(( result )=>{
                        if(result && result.success === true) {
                            res.status(200).json(result)
                            } else {
                                res.status(200).json(result)
                            }
                    });
                //     } else {
                //         res.status(200).json(result)
                //     }
                // });          
            }
         } catch (e) {
             console.log("Error",e);
             res.status(500).json({success: false, message: "Error:"+e, data:arryEmpty});
         }
 
    });


}