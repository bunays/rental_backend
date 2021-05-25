
const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');
var CATEGORYREPORT = require('../models/city-report-models');

/*
     TODO @Function:
     */





module.exports = {

    //This fucntion validate details from category form.

    funCityValidateDetails: ValidateDetails = (strActionType, req, db) => { 
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
               
                let strCityName= obj.strCityName;
                let fkIntLoginUserId = obj.intLoginUserId;
                let pkIntCityId = obj.pkIntCityId;
                let fkIntStateId = obj.fkIntStateId;
                let parentid=obj.intParentId;
         
                strCityName = (strCityName && typeof strCityName === 'string') ? strCityName.trim() : null;
                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string')? ObjectID(fkIntLoginUserId.trim()) : null;
                fkIntStateId = (fkIntStateId && typeof fkIntStateId === 'string')? ObjectID( fkIntStateId.trim()) : null;
                pkIntCityId = (pkIntCityId && typeof pkIntCityId === 'string')? ObjectID( pkIntCityId.trim()) : null;
                
                if (pkIntCityId || strActionType === 'SAVE') {
                    if (strCityName) {
                        if (fkIntStateId) {
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
                            resolve({success: false, message: 'State  Id is  not found', data: arryEmpty});
                        }
                           
                    } else {
                        resolve({success: false, message: 'City   name  not found', data: arryEmpty});
                    }
                } else {
                    resolve({success: false, message: 'Cityid  name is  not found', data: arryEmpty});
                }
                
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });
    },

    funSaveCityDetails: funInsertCityDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
               
                const newObject = {
                    
                    pkIntCityId:ObjectID(),
                    strCityName: upperCase(obj.strCityName),
                    fkIntStateId: ObjectID(obj.fkIntStateId),
                    fkIntCreateUserId: ObjectID(obj.intLoginUserId),
                    datCreateDateAndTime: new Date(),
                    datLastModifiedDateTime :null,
                    fkIntLastModifiedId: null,
                    strStatus: "N" ,

                };
                db.collection(config.CITY_COLLECTION).insert(newObject, (err, doc) => {

                    if (err)resolve({success: false, message: 'CITY Creation Failed.',arryEmpty});

                    else if(doc && doc.ops && doc.ops.length === true) {
                  
                    }
                    else{
                        resolve({success: true, message: 'CITY saved successfully.', data: [doc.ops[0]]});
                    }


                })


            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },
    
    funUpdateCityDetails: funUpdateCityDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                      
                let pkIntCityId =obj.pkIntCityId;
               
                var match = {$match: {pkIntCityId: ObjectID(pkIntCityId)}};
                db.collection(config.CITY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    console.log("update datas ?",response)
                    if (response.length) {
                       
                        const newObject = {

                           strCityName:upperCase(obj.strCityName),
                           fkIntStateId:ObjectID(obj.fkIntStateId),
                           datLastModifiedDateTime : new Date(),
                           fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),
                           
                        };
                        var query = {pkIntCityId: ObjectID(pkIntCityId)};
                        db.collection(config.CITY_COLLECTION).update(query, {$set: newObject}, (err, doc) => {
                            if (err) resolve({success: false, message: 'City Update Failed.', data: arryEmpty});
                            else{
                                resolve({success: true, message: 'City Updated successfully.', data: [newObject]});
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
     
    funCitydeleteValidateDetails: ValidateDetails = (strActionType, req, db) => {
        console.log("enter in ValidateDetails",req.body )
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
                           
                let pkIntCityId = obj.pkIntCityId;  
                let  fkIntLoginUserId = obj.intLoginUserId;                                    
            
                pkIntCityId = (pkIntCityId && typeof pkIntCityId === 'string')? ObjectID( pkIntCityId.trim()) : null;
               
                console.log("pkIntCountryId  || strActionType",pkIntCityId)
              
                if (pkIntCityId || strActionType === 'SAVE') {   
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
                resolve({success: false, message: 'pkIntCityId  ID is  not found', data: arryEmpty});
                }
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });
    },

    funDeleteCity: funDeleteCountry = (obj, db) => {
        console.log("reched here funDeleteCity")
        return new Promise((resolve, reject) => {
            try {
              
                let pkIntCityId = obj.pkIntCityId;
                
  
                var match = {$match: {pkIntCityId: ObjectID(pkIntCityId)}};
                db.collection(config.CITY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                           
                            datLastModifiedDateTime : new Date(),
                            fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),
                            strStatus: 'D',
                        };
                        var query = {pkIntCityId: ObjectID(pkIntCityId)};
                        db.collection(config.CITY_COLLECTION).update(query, {$set: newObject}, (err) => {
                            if (err) throw err
                            
                            resolve({success: true, message: 'City deleted successfully.', data: [newObject]});
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