module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../config/config');
    const common = require('../globel/common');
    const CITYMODELS = require('../models/city-model');
    const CITYREPORT  = require('../models/city-report');
    const arryEmpty =[];

    /*
    TODO:This api use Save City details in Data Base
    @Function: Save user details Data
    */

    app.post('/api/city/SavenewCity', (req,res) =>{       
    try{
    var obj = req.body;
    var strActionType ="SAVE";
        if(!obj)
        {
            res.status(500).json({success: false, message: 'Params missing', data:arryEmpty});
        } else {
        CITYMODELS.funCityValidateDetails(strActionType,req,db).then(( result )=>{
            if(result && result.success === true) {
                    CITYMODELS.funSaveCityDetails(obj,db).then(( result )=>{
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

    app.post('/api/city/getListAllCityDetails', (req,res) =>{
    try{
        var obj = req.body
        if(!obj)
        {
            res.json({success: false, message: 'Params missing',data:arryEmpty});
        } else
        {
            CITYREPORT.funGetAllCityDetails(obj,db).then(( result )=>{
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

    app.post('/api/City/UpdateCityDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                CITYMODELS.funCityValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {

                        CITYMODELS.funUpdateCityDetails(obj,db).then(( result )=>{
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

    app.post('/api/city/DeleteCityDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                CITYMODELS.funCitydeleteValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        CITYMODELS.funDeleteCity(obj,db).then(( result )=>{
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

    app.post('/api/city/autoCompleteCity', (req,res) =>{
        try{
            
            var obj = req.body;
            if(!obj)
            {
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else
            {
                CITYREPORT.funGetAllCities(obj,db).then(( result )=>{
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

    app.post('/api/city/FindDonationWithCity', (req,res) =>{
        try{
            
            var obj = req.body;
            if(!obj)
            {
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else
            {
                CITYREPORT.funfindfoodincities(obj,db).then(( result )=>{
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


}