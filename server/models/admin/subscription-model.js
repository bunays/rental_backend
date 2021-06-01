
const config = require('../../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};

const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

           //This fucntion validate details from Subscription form.
        funSubscriptionValidateDetails: ValidateDetails = (strActionType, req, db) => {
            return new Promise((resolve, reject) => {
                var obj = req.body;
    
                try {

                    let pkIntSubscriptionId = obj.pkIntSubscriptionId;
                    let PlanName = obj.PlanName;
                    let Period  = obj.Period ;
                    let Price   = obj.Price  ;
                    let CurrencyType = obj.CurrencyType;
          
                    pkIntSubscriptionId = (pkIntSubscriptionId && typeof pkIntSubscriptionId === 'string') ? ObjectID(pkIntSubscriptionId.trim()) : null;
                    PlanName = (PlanName && typeof PlanName === 'string') ? PlanName.trim() : null;
                    Period = (Period && typeof Period === 'string') ? Period.trim() : null;
                    Price = (Price && typeof Price === 'string') ? Price.trim() : null;
                    CurrencyType = (CurrencyType && typeof CurrencyType === 'string') ? CurrencyType.trim() : null;
                
                    if (pkIntSubscriptionId || strActionType === 'SAVE') {
                        if (PlanName) {
                            if (Period) {
                                if (Price) {
                                    if (CurrencyType) {
                        
                                        resolve({ success: true,   message: 'Pass validate', data: arryEmpty });

                                    }else{
                                        resolve({success: false, message: ' CurrencyType not found', data: arryEmpty});
                                    }
                                }else{
                                    resolve({success: false, message: 'Price not found', data: arryEmpty});
                                }
                            } else {
                                resolve({success: false, message: 'Period not found', data: arryEmpty});
                            }
                        } else {
                            resolve({success: false, message: 'Plan Name is  not found', data: arryEmpty});
                        }   
                    } else {
                        resolve({success: false, message: 'pkIntSubscriptionId is  not found', data: arryEmpty});
                    }
                    
                } catch (e) {
                    throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
                }
    
            });
        },
    
            //This fucntion insert details from Subscription form.
        funSubscriptionDetails: InsertSubscriptionDetails = (obj, db) => {
            return new Promise((resolve, reject) => {
                try {

                    const newObject = {
                        pkIntSubscriptionId:ObjectID(),
                        PlanName: obj.PlanName,
                        Period: obj.Period,
                        Price: obj.Price,
                        CurrencyType: obj.CurrencyType,
                        datCreateDateAndTime: new Date(),
                        datLastModifiedDateTime: null,
                        strStatus: 'N',
                       
                    };
                    db.collection(config.SUBSCRIPTION_COLLECTION).insert(newObject, (err, doc) => {
                        if (err)resolve({success: false, message: 'Subscription Creation Failed.', data: [doc.ops]});
                        else{
                            resolve({success: true, message: 'Subscription saved successfully.', data: [doc.ops[0]]});
                        }
                    })
                } catch (e) {
                    throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
                }
            });
    
        },
    
}