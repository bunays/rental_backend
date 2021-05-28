const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

        //This function validate details from booking form.
    funValidatebookingDetails: ValidateDetails = (strActionType, req, db) => {
        console.log("enter into funUserValidateDetails ",req.body)
   
   
        return new Promise((resolve, reject) => {
             var obj = req.body;
             try {
                  let pkIntBookingId = obj.pkIntBookingId;
                //   let fkIntProductId = obj.fkIntProductId;
                //     let intdblMRP = obj.intdblMRP;
                //   let intUserGroupTypeId=obj.intUserGroupTypeId;
                //   let fkIntOrganisationId = obj.intOrganisationId;
                  let fkIntLoginUserId = obj.intLoginUserId;
                
                  pkIntBookingId = (pkIntBookingId && typeof pkIntBookingId === 'string') ? ObjectID(pkIntBookingId.trim()) : null;
                //   intqty = (intqty && typeof intqty  === 'number') ? intqty : 0;
                //   fkIntProductId = (fkIntProductId && typeof fkIntProductId === 'string') ? ObjectID(fkIntProductId.trim()) : null;
                //    intdblMRP = (intdblMRP && typeof intdblMRP === 'number') ? intdblMRP : 0;
                //   intUserGroupTypeId = (intUserGroupTypeId && typeof intUserGroupTypeId === 'string') ? ObjectID(intUserGroupTypeId.trim()) : null;
                //   fkIntOrganisationId = (fkIntOrganisationId && typeof fkIntOrganisationId === 'string') ? ObjectID(fkIntOrganisationId.trim()) : null;
                  fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string') ? ObjectID(fkIntLoginUserId.trim()) : null;
   
                  if (pkIntBookingId || strActionType === 'SAVE') {
                    //    if (intqty) {
                    //         if (fkIntProductId) {
                    //              if (fkIntOrganisationId) {
                    //                    if (intdblMRP) {
                    //                        if(intUserGroupTypeId){
                                            if (fkIntLoginUserId) {
                                                var match = {$match: {pkIntUserId: ObjectID(fkIntLoginUserId) }};
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
                                            resolve({success: false, message: '  Invalid User', data: arryEmpty});
                                            }
                                        //    } else {
                                        //    resolve({success: false, message: 'Invalid User Group ', data: arryEmpty});
                                        //    }
                    //                   } else {
                    //                   resolve({success: false, message: 'MRP not found', data: arryEmpty});
                    //                   }
                    //              } else {
                    //              resolve({success: false, message: 'Invalid  Organisation  ', data: arryEmpty});
                    //              }
                    //         } else {
                    //         resolve({success: false, message: 'product Id is not found', data: arryEmpty});
                    //         }
                    //    } else {
                    //    resolve({success: false, message: 'Quantity  is  not found', data: arryEmpty});
                    //    }
                  } else {
                  resolve({success: false, message: 'pkIntBookingId Id is  not found', data: arryEmpty});
                  }
             } catch (e) {
             throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
             }
        });
    },
   
        //This function validate details from booking form.
    funSavebookingDetails: funInsertBookingDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                
                const newObject = {
                    pkIntBookingId: ObjectID(),
                    // intqty:parseFloat(obj.intQuantity),
                    // intdblMRP : parseFloat(obj.intdblMRP),
                    fkIntProductId :  ObjectID(obj.fkIntProductId),
                    // fkIntUserGroupTypeId:ObjectID(obj.intUserGroupTypeId),
                    // fkIntOrganisationId: ObjectID(obj.intOrganisationId),
                    fkIntCreateUserId: ObjectID(obj.intLoginUserId),
                    datCreateDateAndTime: new Date(),
                    datLastModifiedDateTime: null,
                    fkIntLastModifiedId: ObjectID(obj.fkIntLoginUserId),
                    blnFreeze: false,
                    strStatus: 'N',
                    

                };
                db.collection(config.BOOKING_COLLECTION).insert(newObject, (err, doc) => {
                    if (err)resolve({success: false, message: 'Booking Creation Failed.', data: arryEmpty});
                        else if(doc && doc.ops && doc.ops.length) {
                            console.log("whats is ehre", doc.ops )

                            let pkIntProductId =obj.fkIntProductId;
                            
                            
                            var match = {$match: {pkIntProductId: ObjectID(pkIntProductId)}};
                            db.collection(config.PRODUCT_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                                
                                if (response.length) {
                                console.log("show here",response.length)
                                                            
                                    const strQuery = {$set :{                                
                                        
                                        datLastModifiedDateTime : new Date(),
                                        fkIntLastModifiedId :ObjectID(obj.fkIntLoginUserId),           
                                    },
                                    $inc: { intQty: -newObject.intqty } };

                                
                                    var query = {pkIntProductId: ObjectID(pkIntProductId)};     
                                    db.collection(config.PRODUCT_COLLECTION).update(query,strQuery, (err, doc) => {
                                        
                                        console.log("updeted or not",strQuery)   
                                        
                                        if (err) resolve({success: false, message: 'Product Update Failed.', data: arryEmpty});
                            })
                            } else {
                                        resolve({success: false, message: 'No Product found', data: arryEmpty});
                                    }
                                });
                    
                        resolve({success: true, message: 'Product saved successfully.', data: [doc.ops[0]]});
                        }
                        
                })
            } catch (e) {
            throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });
    },
}