module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../config/config');
    const common = require('../globel/common');
    const PRODUCTMODELS = require('../models/product-model');
    const PRODUCTREPORT  = require('../models/product-report');
    const arryEmpty =[];



    /*
    TODO:This api used to save product details in  Data Base
    @Function: Save product details Data
    */

    app.post('/api/product/SaveProductDetails', (req,res) =>{
        try{
            var obj = req.body;
            var strActionType ="SAVE";
            if(!obj) { 
                res.status(200).json({success: false, message: 'Params missing', data:arryEmpty});
            } else {
                PRODUCTMODELS.funProductValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        PRODUCTMODELS.funSaveProdcutDetails(obj,db).then(( result )=>{
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
            res.status(200).json({success: false, message: "Error:"+e, data:arryEmpty});
        }

    });





}