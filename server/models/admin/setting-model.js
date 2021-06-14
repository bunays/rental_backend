
const config = require('../../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};

const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();
const common = require('../../globel/common');
var arryEmpty = [];
var upperCase = require('upper-case');


/*
     TODO @Function:
     */

module.exports = {

    funUpdateSettingDetails: funUpdateSettingDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                querySetting = {strStatus:'N'}
                db.collection(config.SETTING_COLLECTION).find(querySetting).toArray( (err,docSetting) => {

                    if(docSetting.length){
                        const Objupdate = {
           
                            commission: Number(obj.commission),
                            datLastModifiedDateTime : new Date(),
                          
                        };
                        var query = {pkIntSettingId: ObjectID(docSetting[0].pkIntSettingId)};
                        db.collection(config.SETTING_COLLECTION).update(query, {$set: Objupdate}, (err, doc) => {
                            if (err) resolve({success: false, message: 'Settings Update Failed.', data: arryEmpty});
                            else{
                                resolve({success: true, message: 'Settings Updated successfully.', data: [Objupdate]});
                            }

                        })

                    } else {
                        const newObject = {
                            pkIntSettingId:ObjectID(),
                            commission : Number(obj.commission ),
                            datCreateDateAndTime: new Date(),
                            datLastModifiedDateTime:null,
                            strStatus: "N" ,
        
                        };
                        db.collection(config.SETTING_COLLECTION).insert(newObject, (err, doc) => {
        
                            if (err)resolve({success: false, message: 'Settings Creation Failed.', data: arryEmpty });
        
                            else if(doc && doc.ops && doc.ops.length) {
                          
                           
                                resolve({success: true, message: 'Settings saved successfully.', data: [doc.ops[0]]});
                            }
                        });
                    }
                })

        
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },
    



}