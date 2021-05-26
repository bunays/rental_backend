

const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

        //This function validate details from category form.
    funCategoryValidateDetails: ValidateDetails = (strActionType, req, db) => { 
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

        //This function insert details from category form.
    funSaveCategoryDetails: funInsertCategoryDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
               
                const newObject = {
                    pkIntCategoryId:ObjectID(),
                    CategoryName: upperCase(obj.CategoryName),
                    CategoryColor: obj.CategoryColor,
                    icon_file_urls: obj.icon_file_urls,
                    img_file_urls: obj.img_file_urls,
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

        //This function update details from category form.
    funUpdateCategoryDetails: funUpdateCategoryDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                  
                let IntCategoryId = obj.pkIntCategoryId;
                let fkIntLoginUserId = obj.intLoginUserId;

                var match = {$match: {pkIntCategoryId: ObjectID(IntCategoryId)}};
                db.collection(config.CATEGORY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                            CategoryName: upperCase(obj.CategoryName),
                            CategoryColor: obj.CategoryColor,
                            icon_file_urls: obj.icon_file_urls,
                            img_file_urls: obj.img_file_urls,
                            status: obj.status,
                            fkIntLastModifiedId: ObjectID(fkIntLoginUserId),
                            datLastModifiedDateTime: new Date(),
                           
                        };
                        var query = {pkIntCategoryId: ObjectID(IntCategoryId)};
                        db.collection(config.CATEGORY_COLLECTION).update(query, {$set: newObject}, (err, doc) => {
                            if (err) resolve({success: false, message: 'Category Update Failed.', data: arryEmpty});
                            else{
                                resolve({success: true, message: 'User saved successfully.', data: [doc]});
                            }

                        })

                    } else {
                        resolve({success: false, message: 'No category found', data: arryEmpty});
                    }
                });
       
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },

        //This function delete validate details from category form.
    fundeleteCategoryValidateDetails: ValidateDetails = (strActionType, req, db) => { 
        return new Promise((resolve, reject) => {
            var obj = req.body;
            try {
               
                let fkIntLoginUserId = obj.intLoginUserId;
                let pkIntCategoryId = obj.IntCategoryId;

                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string')? ObjectID(fkIntLoginUserId.trim()) : null;
                pkIntCategoryId = (pkIntCategoryId && typeof pkIntCategoryId === 'string')? ObjectID( pkIntCategoryId.trim()) : null;

                if (pkIntCategoryId || strActionType === 'SAVE') {
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
                } else {
                resolve({success: false, message: 'Categoryid  name is  not found', data: arryEmpty});
                }

            } catch (e) {
            throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });
    },

        //This function Delete details from category form.
    funDeleteCategory: funDeleteCategory = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
              
                let IntCategoryId = obj.IntCategoryId;
                let fkIntLoginUserId = obj.intLoginUserId;

                var match = {$match: {pkIntCategoryId: ObjectID(IntCategoryId)}};
                db.collection(config.CATEGORY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                           
                            datLastModifiedDateTime: new Date(),
                            fkIntLastModifiedId: ObjectID(fkIntLoginUserId),
                            strStatus: 'D',
                        };
                        var query = {pkIntCategoryId: ObjectID(IntCategoryId)};
                        db.collection(config.CATEGORY_COLLECTION).update(query, {$set: newObject}, (err) => {
                            if (err) throw err
                            
                            resolve({success: true, message: 'Category deleted successfully.', data: [newObject]});
                        })
                    } else {
                        resolve({success: false, message: 'Category not found', data: arryEmpty});
                    }
                });
          
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });


    }

}