module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../../config/config');
    const common = require('../../globel/common');
    const PRODUCTMODELS = require('../../models/rental/product-model');
    const PRODUCTREPORT  = require('../../models/rental/product-report');
    const arryEmpty =[];



    /*
    TODO:This api used to save product details in  Data Base
    @Function: save product details Data
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

    /*
    TODO:This api used to update product details in  Data Base
    @Function: update product details Data
    */    
    app.post('/api/product/UpdateProductDetails', (req,res) => {
        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                PRODUCTMODELS.funProductValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        PRODUCTMODELS.funUpdateProductDetails(obj,db).then(( result )=>{
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
    TODO:This api used to delete product details in  Data Base
    @Function: delete product details Data
    */    
    app.post('/api/product/DeleteProductDetails', (req,res) => {
        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                PRODUCTMODELS.fundeleteProductValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        PRODUCTMODELS.funDeleteProduct(obj,db).then(( result )=>{
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
    TODO:This api use List subCategory details in Data Base
    @Function: Listing subCategory details Data
    */
    app.post('/api/product/getListAllProductDetails',(req,res) => {
        try{
            var obj = req.body
            if(!obj){
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else {
                PRODUCTREPORT.funGetAllProductDetails(obj,db).then(( result )=>{
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