
module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../../config/config');
    const common = require('../../globel/common');
    const SETTINGMODELS = require('../../models/admin/setting-model');
    const SETTINGREPORT  = require('../../models/admin/setting-report');
    const arryEmpty =[];


    /*
    TODO:This api use Save and Update Settings details in Data Base
    @Function: Save and Update Settings details Data
    */
    app.post('/api/admin/add_edit_settings', (req,res) =>{   
        try{
            var obj = req.body;
            var strActionType ="SAVE";
            var strActionTypes ="UPDATE";
            if(common.isEmptyObject(obj)) {    
                res.status(200).json({success: false, message: 'Params missing', data:arryEmpty});    
            } else {
    
                SETTINGMODELS.funUpdateSettingDetails(obj,db).then(( result )=>{
                    if(result && result.success === true) {
                        res.status(200).json(result)
                    }
                    else {
                        res.status(200).json(result)
                    }
                });
                 
            }
        } catch (e) {
            console.log("Error",e);
            res.status(500).json({success: false, message: "Error:"+e, data:arryEmpty});
        }

    });

    /*
    TODO:This api use Listing Settings details in Data Base
    @Function: Listing Settings details Data
    */
    app.post('/api/admin/list_settings', (req,res) =>{
        try{
            var obj = req.body
            if(common.isEmptyObject(obj)) {    
                res.status(200).json({success: false, message: 'Params missing', data:arryEmpty});    
            } else { 
                SETTINGREPORT.funGetAllSettingListDetails(obj,db).then(( result )=>{
                    if(result && result.success === true) {
                        res.status(200).json(result)
                    }
                    else {
                        res.status(200).json(result)
                    }
                });
            }
        }catch (e) {
            console.log("Error",e);
            res.status(500).json({success: false, message: "Error:"+e, data:arryEmpty});
        }
    
    
    });

}