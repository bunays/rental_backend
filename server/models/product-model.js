const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};

const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];
var upperCase = require('upper-case');


module.exports = {

     //This function validate details from product form.
     funProductValidateDetails: ValidateDetails = (strActionType, req, db) => { 
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
              
                let pkIntProductId = obj.pkIntProductId;
                let fkIntLoginUserId = obj.intLoginUserId;
         
                // CategoryName = (CategoryName && typeof CategoryName === 'string') ? CategoryName.trim() : null;
                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string')? ObjectID(fkIntLoginUserId.trim()) : null;
                pkIntProductId = (pkIntProductId && typeof pkIntProductId === 'string')? ObjectID( pkIntProductId.trim()) : null;

                if (pkIntProductId || strActionType === 'SAVE') {
                    // if (CategoryName) {
                    //     if (CategoryColor) {
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
                                resolve({success: false, message: ' Invalid User', data: arryEmpty});
                            }
                    //     } else {
                    //         resolve({success: false, message: 'Category  color is  not found', data: arryEmpty});
                    //     }
                    // } else {
                    //     resolve({success: false, message: 'Category  name is  not found', data: arryEmpty});
                    // }
                } else {
                    resolve({success: false, message: 'pkIntProductId is  not found', data: arryEmpty});
                }
                
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });
    },

        //This function insert details from product form.
    funSaveProdcutDetails: InsertProductDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
               
                const newObject = {
                    pkIntProductId:ObjectID(),
                    ProductName: upperCase(obj.ProductName),
                    ProductId : obj.ProductId,
                    fkIntCategoryId: ObjectID(obj.IntCategoryId),
                    fkIntsubCategoryId: ObjectID(obj.IntsubCategoryId),
                    status: obj.status,
                    fkIntCreateUserId: ObjectID(obj.intLoginUserId),
                    datCreateDateAndTime: new Date(),
                    datLastModifiedDateTime: null,
                    fkIntLastModifiedId: null,
                    strStatus: 'N',
                   
                };
                db.collection(config.CATEGORY_COLLECTION).insert(newObject, (err, doc) => {

                    if (err)resolve({success: false, message: 'Category Creation Failed.', data: [doc.ops]});
                        else if(doc && doc.ops && doc.ops.length === true) {
                            console.log()
                            objValue =doc.ops[0];
                            objData ={strDocumentNo:ObjectID(pkIntCategoryId)}
                        }
                    else{
                        resolve({success: true, message: 'category saved successfully.', data: [doc.ops[0]]});
                    }
                })
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },

}