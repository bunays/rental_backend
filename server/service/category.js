module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../config/config');
    const common = require('../globel/common');
    const CATEGORYMODEL = require('../models/category-model');
    const CATEGORYREPORT  = require('../models/category-report');
    const arryEmpty =[];



    /*
    TODO:This api use Save Category details in Data Base
    @Function: Save user details Data
    */


    app.post('/api/category/Savenewcategory', (req,res) =>{   
        try{
            var obj = req.body;
            var strActionType ="SAVE";
            if(!obj)
            {
                res.status(500).json({success: false, message: 'Params missing', data:arryEmpty});
            } else {
                CATEGORYMODEL.funCategoryValidateDetails(strActionType,req,db).then(( result )=>{
                        if(result && result.success === true) {
                            console.log("funSaveCategoryDetails",req.body)

                            CATEGORYMODEL.funSaveCategoryDetails(obj,db).then(( result )=>{
                            if(result && result.success === true) {
                                console.log("funSaveCategoryDetails OF THE  details ",req.body)

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