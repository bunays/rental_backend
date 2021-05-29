module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    const config = require('../../config/config');
    const common = require('../../globel/common');
    const STATEMODELS = require('../../models/admin/state-model');
    const STATEREPORT  = require('../../models/admin/state-report');
    const arryEmpty =[];

    /*
    TODO:This api use Save State details in Data Base
    @Function: Save user details Data
    */
    app.post('/api/state/SavenewState', (req,res) =>{   
        try{
            var obj = req.body;
            var strActionType ="SAVE";
            if(!obj)
            {
                res.status(500).json({success: false, message: 'Params missing', data:arryEmpty});
            } else {
                STATEMODELS.funStateValidateDetails(strActionType,req,db).then(( result )=>{
                        if(result && result.success === true) {

                            STATEMODELS.funSaveStateDetails(obj,db).then(( result )=>{
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
    TODO:This api use Update State details in Data Base
    @Function: Update user details Data
    */
    app.post('/api/State/UpdateStateDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                STATEMODELS.funStateValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {

                        STATEMODELS.funUpdateStateDetails(obj,db).then(( result )=>{
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
    TODO:This api use Delete State details in Data Base
    @Function: Delete user details Data
    */
    app.post('/api/state/DeleteStateDetails', (req,res) => {

        try{
            var obj = req.body;
            var strActionType ="UPDATE";
            if(!obj) {
                res.json({success: false, message: 'Parameter missing',data:arryEmpty});
            } else {
                STATEMODELS.funStatedeleteValidateDetails(strActionType,req,db).then(( result )=>{
                    if(result && result.success === true) {
                        STATEMODELS.funDeleteState(obj,db).then(( result )=>{
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
    TODO:This api use Listing State details in Data Base
    @Function: Listing user details Data
    */
    app.post('/api/state/getListAllStateDetails', (req,res) =>{
        try{
            var obj = req.body
            if(!obj)
            {
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else
            {
                STATEREPORT.funGetAllStateDetails(obj,db).then(( result )=>{
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

    /*
    TODO:This api use Auto complete State details in Data Base
    @Function: Auto complete user details Data
    */
    app.post('/api/state/autoCompleteState', (req,res) =>{
        try{
        
            var obj = req.body;
            if(!obj)
            {
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else
            {
                STATEREPORT.funGetAllStates(obj,db).then(( result )=>{
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