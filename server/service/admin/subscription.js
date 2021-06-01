module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../../config/config');
    const common = require('../../globel/common');
    const SUBSCRIPTIONMODEL = require('../../models/admin/subscription-model');
    const SUBSCRIPTIONREPORT  = require('../../models/admin/subscription-report');
    const arryEmpty =[];


    /*
    TODO:This api use Save Subscription details in Data Base
    @Function: Save Subscription details Data
    */
    app.post('/api/Subscription/SavenewSubscription', (req,res) =>{   
        try{
            var obj = req.body;
            var strActionType ="SAVE";
            if(!obj)
            {
                res.status(500).json({success: false, message: 'Params missing', data:arryEmpty});
            } else {
                SUBSCRIPTIONMODEL.funSubscriptionValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        SUBSCRIPTIONMODEL.funSubscriptionDetails(obj,db).then(( result )=>{
                            if(result && result.success === true) {
                                res.status(200).json(result)
                            } else {
                                res.status(200).json(result)
                            }
                        });

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