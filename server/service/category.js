module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    const config = require('../config/config');
    const common = require('../globel/common');
    const CATEGORYMODEL = require('../models/category-model');
    const CATEGORYREPORT  = require('../models/category-report');
    const arryEmpty =[];



    /*
    TODO:This api use Save Category details in Data Base
    @Function: Save Category details Data
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
                            CATEGORYMODEL.funSaveCategoryDetails(obj,db).then(( result )=>{
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
    TODO:This api use Update Category details in Data Base
    @Function: Update Category details Data
    */
    app.post('/api/category/UpdateCategoryDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                CATEGORYMODEL.funCategoryValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        CATEGORYMODEL.funUpdateCategoryDetails(obj,db).then(( result )=>{
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
    TODO:This api use Delete Category details in Data Base
    @Function: Delete Category details Data
    */
    app.post('/api/category/DeleteCategoryDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                CATEGORYMODEL.fundeleteCategoryValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        CATEGORYMODEL.funDeleteCategory(obj,db).then(( result )=>{
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
    TODO:This api use List Category details in Data Base
    @Function: Listing Category details Data
    */
    app.post('/api/category/getListAllCategoryDetails',(req,res) => {
        try{
            var obj = req.body
            if(!obj){
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else {
                CATEGORYREPORT.funGetAllCategoryDetails(obj,db).then(( result )=>{
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