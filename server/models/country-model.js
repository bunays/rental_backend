

const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');


module.exports = {

    //This function validate details from country form.
    funCountryValidateDetails: ValidateDetails = (strActionType, req, db) => { 
        console.log("funCountryValidateDetails ...",req.body)
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
               
                let CountryName = obj.CountryName;
                let fkIntLoginUserId = obj.intLoginUserId;
                let pkIntCountryId = obj.pkIntCountryId;
                let parentid=obj.intParentId;
         
                CountryName = (CountryName && typeof CountryName === 'string') ? CountryName.trim() : null;
                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string')? ObjectID(fkIntLoginUserId.trim()) : null;
                pkIntCountryId = (pkIntCountryId && typeof pkIntCountryId === 'string')? ObjectID( pkIntCountryId.trim()) : null;
                
                if (pkIntCountryId || strActionType === 'SAVE') {
                    if (CountryName) {
                        if (fkIntLoginUserId) {
                            var match = {$match: {pkIntUserId:ObjectID(fkIntLoginUserId)}};
                            db.collection(config.USER_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
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

    //This function save details from country form.
    funSaveCountryDetails: funInsertCOUNTRYDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
               
                const newObject = {
                    pkIntCountryId:ObjectID(),
                    CountryName: upperCase(obj.CountryName),
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

    //This function update details from country form.
    funUpdateCountryDetails: funUpdateCountryDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                      
                let IntCountryId =obj.pkIntCountryId;
               
                var match = {$match: {pkIntCountryId: ObjectID(IntCountryId)}};
                db.collection(config.COUNTRY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                           CountryName:upperCase(obj.CountryName),
                           datLastModifiedDateTime : new Date(),
                           fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),
                        };
                        var query = {pkIntCountryId: ObjectID(IntCountryId)};
                        db.collection(config.COUNTRY_COLLECTION).update(query, {$set: newObject}, (err, doc) => {
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
    
    //This function delete validate details from country form.
    funCountrydeleteValidateDetails: ValidateDetails = (strActionType, req, db) => {
        return new Promise((resolve, reject) => {
            var obj = req.body;
            try {
                           
                let pkIntCountryId = obj.IntCountryId;  
                let  fkIntLoginUserId = obj.intLoginUserId;                                    
            
                pkIntCountryId = (pkIntCountryId && typeof pkIntCountryId === 'string')? ObjectID( pkIntCountryId.trim()) : null;
              
                if (pkIntCountryId || strActionType === 'SAVE') {   
                    if (fkIntLoginUserId) {
                        var match = {$match: {pkIntUserId:ObjectID(fkIntLoginUserId)}};
                        db.collection(config.USER_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
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

    //This function delete details from country form.
    funDeleteCountry: funDeleteCountry = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
              
                let IntCountryId = obj.IntCountryId;
                
  
                var match = {$match: {pkIntCountryId: ObjectID(IntCountryId)}};
                db.collection(config.COUNTRY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                            datLastModifiedDateTime : new Date(),
                            fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),
                            strStatus: 'D',
                        };
                        var query = {pkIntCountryId: ObjectID(IntCountryId)};
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