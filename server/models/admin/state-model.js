

const config = require('../../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};

const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];
var upperCase = require('upper-case');


module.exports = {

        //This fucntion validate details from state form.
    funStateValidateDetails: ValidateDetails = (strActionType, req, db) => { 
         return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
                let StateName= obj.StateName;
                let pkIntStateId = obj.pkIntStateId;
                let fkIntCountryId = obj.fkIntCountryId;  
         
                StateName = (StateName && typeof StateName === 'string') ? StateName.trim() : null;
                fkIntCountryId = (fkIntCountryId && typeof fkIntCountryId === 'string')? ObjectID( fkIntCountryId.trim()) : null;
                pkIntStateId = (pkIntStateId && typeof pkIntStateId === 'string')? ObjectID( pkIntStateId.trim()) : null;
                
                if (pkIntStateId || strActionType === 'SAVE') {
                    if (StateName) {
                        if (fkIntCountryId) {
                            resolve({ success: true,  message: 'Pass validate', data: arryEmpty });
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

        //This fucntion insert details from state form.
    funSaveStateDetails: funInsertStateDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
               
                const newObject = {
                    pkIntStateId:ObjectID(),
                    StateName: upperCase(obj.StateName),
                    fkIntCountryId:ObjectID(obj.fkIntCountryId),
                    datCreateDateAndTime: new Date(),
                    datLastModifiedDateTime:null,
                    strStatus: "N",
                };

                db.collection(config.STATE_COLLECTION).insert(newObject, (err, doc) => {
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
   
        //This fucntion update details from state form.
    funUpdateStateDetails: funUpdateStateDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                      
                let IntStateId =obj.pkIntStateId;
               
                var match = {$match: {pkIntStateId: ObjectID(IntStateId)}};
                db.collection(config.STATE_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                       
                        const newObject = {

                           StateName:upperCase(obj.StateName),
                           fkIntCountryId:ObjectID(obj.fkIntCountryId),
                           datLastModifiedDateTime : new Date(),
                           fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),
                           
                        };
                        var query = {pkIntStateId: ObjectID(IntStateId)};
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

        //This fucntion delete validate details from state form.
    funStatedeleteValidateDetails: ValidateDetails = (strActionType, req, db) => {
        return new Promise((resolve, reject) => {
            var obj = req.body;
            try {
                           
                let pkIntStateId = obj.IntStateId;                                     
            
                pkIntStateId = (pkIntStateId && typeof pkIntStateId === 'string')? ObjectID( pkIntStateId.trim()) : null;
              
                if (pkIntStateId || strActionType === 'SAVE') {   
                    
                    resolve({ success: true, message: 'Pass validate', data: arryEmpty });
                           
                } else {
                    resolve({success: false, message: 'pkIntStateId  ID is  not found', data: arryEmpty});
                }
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });
    },

        //This fucntion delete details from state form.
    funDeleteState: funDeleteCountry = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
              
                let IntStateId = obj.IntStateId;
                
                var match = {$match: {pkIntStateId: ObjectID(IntStateId)}};
                db.collection(config.STATE_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                            datLastModifiedDateTime : new Date(),
                            strStatus: 'D',
                        };
                        var query = {pkIntStateId: ObjectID(IntStateId)};
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