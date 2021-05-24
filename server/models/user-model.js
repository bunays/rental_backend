const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();
const common = require('../globel/common');
var arryEmpty = [];
const jwt = require('jsonwebtoken');
var upperCase = require('upper-case');
const randomstring =require('randomstring')

/*
     TODO @Function:
     */

module.exports = {

    funRegisterUserDetails: InsertUserDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                let newObject = {}
    
                db.collection(config.USER_COLLECTION).findOne({email:obj.email}).then(user=>{
                    if(user){
                        resolve({ success: false, message: 'Email already exists',data:[] });
                    }else{
                        var passObj = common.setPassword(obj.password);

                        const newObject = {
                            pkIntUserId : ObjectID(),
                            email : obj.email.toLowerCase(),
                            password : passObj.hash,
                            strPrePassword: passObj.salt,
                            datCreateDateAndTime: new Date(),
                            datLastModifiedDateTime: null,
                            strStatus: 'N',
                        };
                        db.collection(config.USER_COLLECTION).insertOne(newObject, (err, doc) => {
                            if (err)resolve({success: false, message: 'user Creation Failed.', data: arryEmpty});
                                
                            else if(doc && doc.ops && doc.ops.length) {
                                let objUserData =doc.ops[0];
                                delete objUserData.password;
                                delete objUserData.strPrePassword;
                        
                                let obj = doc.ops
                        
                                var objPasData = {email: obj.email, intUserId: doc.ops[0].intUserId};
                                jwt.sign({user: objPasData}, config.JWT_SECRET, (err, token) => {
                                    
                                    if (obj.deviceType && obj.deviceToken) {
                                        var userDeviceData = {
                                            intUserId: doc[0].intUserId,
                                            deviceType: obj.deviceType,
                                            deviceToken: obj.deviceToken,
                                            token: token,
                                            addTime: Date.now(),
                                            status: 0
                                        };
                                        db.collection(config.USER_DEVICES_COLLECTION).insertOne(userDeviceData, (e1, userDeviceData) => {
                                            resolve ({
                                                success: true,
                                                message: 'You are login',
                                                data: doc,
                                                token: token,
                                                data: [objUserData]
                                                
                                            });
                                        });
                                    } else {
                                        resolve({
                                            success: true,
                                            message: 'You are login',
                                            data: doc,
                                            token: token,
                                            data: [objUserData]
                                        })
                                    }
                                })
                        
                            } 
                        }); 
                       

                    }
                });
              

            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });
    }
    

}