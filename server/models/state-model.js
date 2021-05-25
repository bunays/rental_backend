

const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');
// var CATEGORYREPORT = require('./city-report-model');

/*
     TODO @Function:
     */

module.exports = {

    //This fucntion validate details from category form.

    funStateValidateDetails: ValidateDetails = (strActionType, req, db) => { 
         return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
               
                let strStateName= obj.strStateName;
                let fkIntLoginUserId = obj.intLoginUserId;
                let pkIntStateId = obj.pkIntStateId;
                let fkIntCountryId = obj.fkIntCountryId;  
                let parentid=obj.intParentId;
         
                strStateName = (strStateName && typeof strStateName === 'string') ? strStateName.trim() : null;
                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string')? ObjectID(fkIntLoginUserId.trim()) : null;
                fkIntCountryId = (fkIntCountryId && typeof fkIntCountryId === 'string')? ObjectID( fkIntCountryId.trim()) : null;
                pkIntStateId = (pkIntStateId && typeof pkIntStateId === 'string')? ObjectID( pkIntStateId.trim()) : null;
                
                if (pkIntStateId || strActionType === 'SAVE') {
                    if (strStateName) {
                        if (fkIntCountryId) {
                            if (fkIntLoginUserId) {
                                var match = {$match: {_id:ObjectID(fkIntLoginUserId)}};
                                db.collection(config.USERS_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                                if(response.length){
                                    resolve({
                                    success: true,
                                    message: 'Pass validate',
                                    data: arryEmpty
                                    });
                                }else{
                                resolve({success: false, message: ' User not found', data: arryEmpty});
                                }
                            });
                            } else {
                            resolve({success: false, message: ' Invalid City User', data: arryEmpty});
                            }
                        } else {
                        resolve({success: false, message: 'country  id is  not found', data: arryEmpty});
                        }
                    } else {
                    resolve({success: false, message: 'State  name is  not found', data: arryEmpty});
                    }
                } else {
                resolve({success: false, message: 'pkIntStateId   is  not found', data: arryEmpty});
                }
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });
    },

    funSaveStateDetails: funInsertStateDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
               
                const newObject = {
                                    pkIntStateId:ObjectID(),
                                    strStateName: upperCase(obj.strStateName),
                                    fkIntCountryId:ObjectID(obj.fkIntCountryId),
                                    fkIntCreateUserId: ObjectID(obj.intLoginUserId),
                                    datCreateDateAndTime: new Date(),
                                    datLastModifiedDateTime:null,
                                    fkIntLastModifiedId: null,
                                    strStatus: "N",
                                 };

                db.collection(config.STATE_COLLECTION).insert(newObject, (err, doc) => {
                    console.log("STATE_COLLECTION).insert newObject",err, doc)

                    if (err)resolve({success: false, message: 'State Creation Failed.', arryEmpty});

                        else if(doc && doc.ops && doc.ops.length === true) {
                    }
                    else{
                        resolve({success: true, message: 'State saved successfully.', data: [doc.ops[0]]});
                    }
                })
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });
    },
   
    funUpdateStateDetails: funUpdateStateDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                      
                let pkIntStateId =obj.pkIntStateId;
               
                var match = {$match: {pkIntStateId: ObjectID(pkIntStateId)}};
                db.collection(config.STATE_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                       
                        const newObject = {

                           strStateName:upperCase(obj.strStateName),
                           fkIntCountryId:ObjectID(obj.fkIntCountryId),
                           datLastModifiedDateTime : new Date(),
                           fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),
                           
                        };
                        var query = {pkIntStateId: ObjectID(pkIntStateId)};
                        db.collection(config.STATE_COLLECTION).update(query, {$set: newObject}, (err, doc) => {
                            if (err) resolve({success: false, message: 'State Update Failed.', data: arryEmpty});
                            else{
                                resolve({success: true, message: 'State Updated successfully.', data: [newObject]});
                            }

                        })

                    } else {
                        resolve({success: false, message: 'No State found', data: arryEmpty});
                    }
                });
       
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },

    funStatedeleteValidateDetails: ValidateDetails = (strActionType, req, db) => {
        console.log("enter in ValidateDetails",req.body )
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
                           
                let pkIntStateId = obj.pkIntStateId;  
                let  fkIntLoginUserId = obj.intLoginUserId;                                    
            
                pkIntStateId = (pkIntStateId && typeof pkIntStateId === 'string')? ObjectID( pkIntStateId.trim()) : null;
               
                console.log("pkIntCountryId  || strActionType",pkIntStateId)
              
                if (pkIntStateId || strActionType === 'SAVE') {   
                    if (fkIntLoginUserId) {
                        var match = {$match: {_id:ObjectID(fkIntLoginUserId)}};
                        db.collection(config.USERS_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                            if(response.length){
                                resolve({
                                    success: true,
                                    message: 'Pass validate',
                                    data: arryEmpty
                                });
                    }else{
                        resolve({success: false, message: ' User not found', data: arryEmpty});
                    }                        
                    }); 
                    } else {
                        resolve({success: false, message: 'User  ID is  not found', data: arryEmpty});
                        }  
                } else {
                resolve({success: false, message: 'pkIntStateId  ID is  not found', data: arryEmpty});
                }
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });
    },

    funDeleteState: funDeleteCountry = (obj, db) => {
        console.log("reched here funDeleteState")
        return new Promise((resolve, reject) => {
            try {
              
                let pkIntStateId = obj.pkIntStateId;
                
  
                var match = {$match: {pkIntStateId: ObjectID(pkIntStateId)}};
                db.collection(config.STATE_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                           
                            datLastModifiedDateTime : new Date(),
                            fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),
                            strStatus: 'D',
                        };
                        var query = {pkIntStateId: ObjectID(pkIntStateId)};
                        db.collection(config.STATE_COLLECTION).update(query, {$set: newObject}, (err) => {
                            if (err) throw err
                            
                            resolve({success: true, message: 'State deleted successfully.', data: [newObject]});
                        })
                    } else {
                        resolve({success: false, message: 'User not found', data: arryEmpty});
                    }
                });
          
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });


    },

}