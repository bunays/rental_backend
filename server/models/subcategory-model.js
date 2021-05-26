
const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};

const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {


    //This fucntion validate details from subcategory form.
    funsubCategoryValidateDetails: ValidateDetails = (strActionType, req, db) => {
        return new Promise((resolve, reject) => {
            var obj = req.body;

            try {
               
                let SubCategoryName = obj.SubCategoryName;
                // let Categorytype = obj.Categorytype;
                let fkIntLoginUserId = obj.intLoginUserId;
                let pkIntsubCategoryId = obj.pkIntsubCategoryId;
         
                SubCategoryName = (SubCategoryName && typeof SubCategoryName === 'string') ? SubCategoryName.trim() : null;
                // Categorytype = (Categorytype && typeof Categorytype === 'string') ? ObjectID (Categorytype.trim()) : null ;
                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string') ? ObjectID(fkIntLoginUserId.trim()) : null;
                pkIntsubCategoryId = (pkIntsubCategoryId && typeof pkIntsubCategoryId === 'string') ? ObjectID(pkIntsubCategoryId.trim()) : null;

                if (pkIntsubCategoryId || strActionType === 'SAVE') {
                    if (SubCategoryName) {
                        // if(Categorytype){
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
                        // } else {
                        //     resolve({success: false, message: 'Category  ID is  not found', data: arryEmpty});
                        // }
                    } else {
                        resolve({success: false, message: 'subCategory  Name is  not found', data: arryEmpty});
                    }   
                } else {
                    resolve({success: false, message: 'pkIntsubCategoryId  id is  not found', data: arryEmpty});
                }
                
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });
    },

    //This fucntion insert details from subcategory form.
    funSavesubCategoryDetails: funInsertCategoryDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
             
                const newObject = {
                    pkIntsubCategoryId:ObjectID(),
                    SubCategoryName: upperCase(obj.SubCategoryName),
                    icon_file_urls: obj.icon_file_urls,
                    img_file_urls: obj.img_file_urls,
                    status: obj.status,
                    fkIntCategoryId: ObjectID(obj.Categorytype),
                    fkIntCreateUserId: ObjectID(obj.intLoginUserId),
                    datCreateDateAndTime: new Date(),
                    datLastModifiedDateTime: null,
                    fkIntLastModifiedId: null,
                    strStatus: 'N',
                   
                };
                db.collection(config.SUBCATEGORY_COLLECTION).insert(newObject, (err, doc) => {
                    if (err)resolve({success: false, message: 'subCategory Creation Failed.', data: [doc.ops]});
                    else{
                        resolve({success: true, message: 'User saved successfully.', data: [doc.ops[0]]});
                    }
                })
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },

    //This fucntion update details from subcategory form.
    funUpdatesubCategoryDetails: funUpdatesubCategoryDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                  
                let IntsubCategoryId = obj.pkIntsubCategoryId;
                let fkIntLoginUserId = obj.intLoginUserId;

                var match = {$match: {pkIntsubCategoryId: ObjectID(IntsubCategoryId)}};
                db.collection(config.SUBCATEGORY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                            subCategoryName: upperCase(obj.subCategoryName),
                            fkIntCategoryId : ObjectID(obj.strCategorytype),
                            icon_file_urls: obj.icon_file_urls,
                            img_file_urls: obj.img_file_urls,
                            status: obj.status,
                            fkIntLastModifiedId: ObjectID(fkIntLoginUserId),
                            datLastModifiedDateTime: new Date(),
                        };
                        var query = {pkIntsubCategoryId: ObjectID(IntsubCategoryId)};
                        db.collection(config.SUBCATEGORY_COLLECTION).update(query, {$set: newObject}, (err, doc) => {
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

     //This fucntion delete validate details from subcategory form.
    funsubCategorydeleteValidateDetails: ValidateDetails = (strActionType, req, db) => {
        return new Promise((resolve, reject) => {
            var obj = req.body;
            try {
               
                let pkIntsubCategoryId = obj.IntsubCategoryId;
                let fkIntLoginUserId = obj.intLoginUserId;
                
                fkIntLoginUserId = (fkIntLoginUserId && typeof fkIntLoginUserId === 'string') ? ObjectID(fkIntLoginUserId.trim()) : null;
                pkIntsubCategoryId = (pkIntsubCategoryId && typeof pkIntsubCategoryId === 'string') ? ObjectID(pkIntsubCategoryId.trim()) : null;

                if (pkIntsubCategoryId || strActionType === 'SAVE') {
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
                    resolve({success: false, message: 'pkIntsubCategoryId  id  not found', data: arryEmpty});
                }
                
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });
    },

    //This fucntion delete details from subcategory form.
    funDeletesubCategory: funDeletesubCategory = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
              
                let IntsubCategoryId = obj.IntsubCategoryId;
                let fkIntLoginUserId = obj.intLoginUserId;
  
                var match = {$match: {pkIntsubCategoryId: ObjectID(IntsubCategoryId)}};
                db.collection(config.SUBCATEGORY_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        const newObject = {
                           
                            datLastModifiedDateTime: new Date(),
                            fkIntLastModifiedId: ObjectID(fkIntLoginUserId),
                            strStatus: 'D',
                        };
                        var query = {pkIntsubCategoryId: ObjectID(IntsubCategoryId)};
                        db.collection(config.SUBCATEGORY_COLLECTION).update(query, {$set: newObject}, (err) => {
                            if (err) throw err
                            
                            resolve({success: true, message: 'subCategory deleted successfully.', data: [newObject]});
                        })
                    } else {
                        resolve({success: false, message: 'subCategory not found', data: arryEmpty});
                    }
                });
          
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }

        });


    }

}