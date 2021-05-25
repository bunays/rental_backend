

const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

    //This fucntion validate details from category form.
    funCategoryValidateDetails: ValidateDetails = (strActionType, req, db) => { 
        console.log("enter in ValidateDetails",req.body )
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
               
                let CategoryName= obj.CategoryName;
                let CategoryColor = obj.CategoryColor;
                let fkIntLoginUserId = obj.intLoginUserId;
                let pkIntCategoryId = obj.pkIntCategoryId;
                let parentid=obj.intParentId;
         
                CategoryName = (CategoryName && typeof CategoryName === 'string') ? CategoryName.trim() : null;
                CategoryColor = (CategoryColor && typeof CategoryColor === 'string') ? CategoryColor.trim() : null;
                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string')? ObjectID(fkIntLoginUserId.trim()) : null;
                pkIntCategoryId = (pkIntCategoryId && typeof pkIntCategoryId === 'string')? ObjectID( pkIntCategoryId.trim()) : null;

                if (pkIntCategoryId || strActionType === 'SAVE') {
                    if (CategoryName) {
                        if (CategoryColor) {
                            if (fkIntLoginUserId) {
                                var match = {$match: {_id:ObjectID(fkIntLoginUserId)}};
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
                        } else {
                            resolve({success: false, message: 'Category  color is  not found', data: arryEmpty});
                        }
                    } else {
                        resolve({success: false, message: 'Category  name is  not found', data: arryEmpty});
                    }
                } else {
                    resolve({success: false, message: 'Categoryid  name is  not found', data: arryEmpty});
                }
                
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });
    },

    //This fucntion insert details from category form.
    funSaveCategoryDetails: funInsertCategoryDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
               
                const newObject = {
                    pkIntCategoryId:ObjectID(),
                    CategoryName: upperCase(obj.CategoryName),
                    icon_file_urls: obj.icon_file_urls,
                    img_file_urls: obj.img_file_urls,
                    status: obj.status,
                    fkIntCreateUserId: ObjectID(obj.intLoginUserId),
                    datCreateDateAndTime: new Date(),
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