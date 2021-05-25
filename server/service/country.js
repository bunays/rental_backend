const countryModels = require('../models/country-models');

module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../config/config');
    const common = require('../globel/common');
    const COUNTRYMODELS = require('../models/country-models');
    const COUNTRYREPORT  = require('../models/country-report-models');
    const arryEmpty =[];



    /*
    TODO:This api use Save Country details in Data Base
    @Function: Save Country details Data
    */
    app.post('/api/country/SavenewCountry', (req,res) =>{   
        try{
            var obj = req.body;
            var strActionType ="SAVE";
            if(!obj)
            {
                res.status(500).json({success: false, message: 'Params missing', data:arryEmpty});
            } else {
                COUNTRYMODELS.funCountryValidateDetails(strActionType,req,db).then(( result )=>{
                        if(result && result.success === true) {
                            COUNTRYMODELS.funSaveCountryDetails(obj,db).then(( result )=>{
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

    app.post('/api/Country/UpdateCountryDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                COUNTRYMODELS.funCountryValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {

                        COUNTRYMODELS.funUpdateCountryDetails(obj,db).then(( result )=>{
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

    app.post('/api/country/DeleteCountryDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                COUNTRYMODELS.funCountrydeleteValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        COUNTRYMODELS.funDeleteCountry(obj,db).then(( result )=>{
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

    app.post('/api/country/getListAllCountryDetails', (req,res) =>{
        try{
            var obj = req.body
            if(!obj)
            {
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else
            {
                COUNTRYREPORT.funGetAllCOUNTRYDetails(obj,db).then(( result )=>{
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

    app.post('/api/country/autoCompleteCountry', (req,res) =>{
        try{
           
            var obj = req.body;
            if(!obj)
            {
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else
            {
                COUNTRYREPORT.funGetAllCountries(obj,db).then(( result )=>{
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