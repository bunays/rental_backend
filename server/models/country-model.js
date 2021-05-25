

const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');
var COUNTRYREPORT = require('./country-report-models');

/*
     TODO @Function:
     */





module.exports = {

    //This fucntion validate details from category form.

    funCountryValidateDetails: ValidateDetails = (strActionType, req, db) => { 
        console.log("funCountryValidateDetails ...",req.body)
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
               
                let strCountryName= obj.strCountryName;
                let fkIntLoginUserId = obj.intLoginUserId;
                let pkIntCountryId = obj.pkIntCountryId;
                let parentid=obj.intParentId;
         
                strCountryName = (strCountryName && typeof strCountryName === 'string') ? strCountryName.trim() : null;
                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string')? ObjectID(fkIntLoginUserId.trim()) : null;
                pkIntCountryId = (pkIntCountryId && typeof pkIntCountryId === 'string')? ObjectID( pkIntCountryId.trim()) : null;
                
                if (pkIntCountryId || strActionType === 'SAVE') {
                    if (strCountryName) {
                        console.log(fkIntLoginUserId)
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
                            resolve({success: false, message: ' Invalid Country User', data: arryEmpty});
                        }
                           
                    } else {
                        resolve({success: false, message: 'Country  name is  not found', data: arryEmpty});
                    }
                } else {
                    resolve({success: false, message: 'Countryid  name is  not found', data: arryEmpty});
                }
                
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });
    },

    funSaveCountryDetails: funInsertCOUNTRYDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
               
                const newObject = {
                    pkIntCountryId:ObjectID(),
                    strCountryName: upperCase(obj.strCountryName),
                    fkIntCreateUserId: ObjectID(obj.intLoginUserId),
                    datCreateDateAndTime: new Date(),
                    datLastModifiedDateTime:null,
                    fkIntLastModifiedId: null,
                    strStatus: "N" ,

                };
                db.collection(config.COUNTRY_COLLECTION).insert(newObject, (err, doc) => {


                    if (err)resolve({success: false, message: 'Country Creation Failed.', data: arryEmpty });

                    else if(doc && doc.ops && doc.ops.length) {
                  
                   
                        resolve({success: true, message: 'Country saved successfully.', data: [doc.ops[0]]});
                    }


                })


            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },

    funUpdateCountryDetails: funUpdateCountryDetails = (obj, db) => {
        console.log("funCountryDonationDetails reched?",obj)
        return new Promise((resolve, reject) => {
            try {
                      
                let pkIntCountryId =obj.pkIntCountryId;
               
                var match = {$match: {pkIntCountryId: ObjectID(pkIntCountryId)}};
                db.collection(config.COUNTRY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    console.log("update datas ?",response)
                    if (response.length) {
                       
                        const newObject = {

                           strCountryName:upperCase(obj.strCountryName),
                           datLastModifiedDateTime : new Date(),
                           fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),

                           
                        };
                        var query = {pkIntCountryId: ObjectID(pkIntCountryId)};
                        db.collection(config.COUNTRY_COLLECTION).update(query, {$set: newObject}, (err, doc) => {
                            console.log("updated COUNTRY_COLLECTION",newObject)
                            if (err) resolve({success: false, message: 'Country Update Failed.', data: arryEmpty});
                            else{
                                resolve({success: true, message: 'Country Updated successfully.', data: [newObject]});
                            }

                        })

                    } else {
                        resolve({success: false, message: 'No Country found', data: arryEmpty});
                    }
                });
       
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },
    
    funCountrydeleteValidateDetails: ValidateDetails = (strActionType, req, db) => {
        console.log("enter in ValidateDetails",req.body )
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
                           
                let pkIntCountryId = obj.pkIntCountryId;  
                let  fkIntLoginUserId = obj.intLoginUserId;                                    
            
                pkIntCountryId = (pkIntCountryId && typeof pkIntCountryId === 'string')? ObjectID( pkIntCountryId.trim()) : null;
               
                console.log("pkIntCountryId  || strActionType",pkIntCountryId)
              
                if (pkIntCountryId || strActionType === 'SAVE') {   
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
                resolve({success: false, message: 'pkIntCountryId  ID is  not found', data: arryEmpty});
                }
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });
    },

    funDeleteCountry: funDeleteCountry = (obj, db) => {
        console.log("reched here funDeleteCountry")
        return new Promise((resolve, reject) => {
            try {
              
                let pkIntCountryId = obj.pkIntCountryId;
                
  
                var match = {$match: {pkIntCountryId: ObjectID(pkIntCountryId)}};
                db.collection(config.COUNTRY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                           
                            datLastModifiedDateTime : new Date(),
                            fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),
                            strStatus: 'D',
                        };
                        var query = {pkIntCountryId: ObjectID(pkIntCountryId)};
                        db.collection(config.COUNTRY_COLLECTION).update(query, {$set: newObject}, (err) => {
                            if (err) throw err
                            
                            resolve({success: true, message: 'Country deleted successfully.', data: [newObject]});
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