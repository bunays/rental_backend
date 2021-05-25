module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../config/config');
    const common = require('../globel/common');
    const SUBCATEGORYMODEL = require('../models/sub category-model');
    const SUBCATEGORYREPORT  = require('../models/sub category-report');
    const arryEmpty =[];


    /*
    TODO:This api use Save subCategory details in Data Base
    @Function: Save subCategory details Data
    */
    app.post('/api/subCategory/SavenewsubCategory', (req,res) =>{   
        try{
            var obj = req.body;
            var strActionType ="SAVE";
            if(!obj)
            {
                res.status(500).json({success: false, message: 'Params missing', data:arryEmpty});
            } else {
                SUBCATEGORYMODEL.funsubCategoryValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        SUBCATEGORYMODEL.funSavesubCategoryDetails(obj,db).then(( result )=>{
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

    /*
    TODO:This api use Update subCategory details in Data Base
    @Function: Update subCategory details Data
    */
    app.post('/api/subCategory/UpdatesubCategoryDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                SUBCATEGORYMODEL.funsubCategoryValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        SUBCATEGORYMODEL.funUpdatesubCategoryDetails(obj,db).then(( result )=>{
                            if(result && result.success === true) {
                                res.status(200).json(result)
                            }
                            else {
                                res.status(200).json(result)
                            }
                        });
                    } else {
                        res.status(200).json(result)
                    }
                });
            }
        }catch (e) {
            console.log("Error",e);
            res.status(500).json({success: false, message: "Error:"+e, data:arryEmpty});
        }

    });

    /*
    TODO:This api use Delete subCategory details in Data Base
    @Function: Delete subCategory details Data
    */
    app.post('/api/subCategory/DeleteCategoryDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                subCategorymodels.funsubCategorydeleteValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        subCategorymodels.funDeletesubCategory(obj,db).then(( result )=>{
                            if(result && result.success === true) {
                                res.status(200).json(result)
                            }
                            else {
                                res.status(200).json(result)
                            }
                        });
                    } else {
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