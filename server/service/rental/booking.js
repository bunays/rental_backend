
module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    const config = require('../../config/config');
    const common = require('../../globel/common');
    const BOOKINGMODEL = require('../../models/rental/booking-model');
    const BOOKINGREPORT  = require('../../models/rental/booking-report');
    const arryEmpty =[];


    /*
    TODO:This api use Save Booking details in Data Base
    @Function: Save Booking details Data
    */
    app.post('/api/booking/SaveBookingDetails', (req,res) => { 
        try{
            var obj = req.body;
            var strActionType ="SAVE";

            if(common.isEmptyObject(obj))
            {
                res.status(200).json({success: false, message: 'Params missing', data:arryEmpty});
            } else { 
                BOOKINGMODEL.funValidatebookingDetails(strActionType,req,db).then(( result )=>{
                if(result && result.success === true) {
                    BOOKINGMODEL.funSavebookingDetails(obj,db).then(( result )=>{
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
    TODO:This api use List booking details in Data Base
    @Function: Listing booking details Data
    */
    app.post('/api/booking/getListAllBookingDetails',(req,res) => {
        try{
            var obj = req.body
            if(!obj){
                res.json({success: false, message: 'Params missing',data:arryEmpty});
            } else {
                BOOKINGREPORT.funGetAllBookingDetails(obj,db).then(( result )=>{
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