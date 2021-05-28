const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};

const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');


module.exports = {
    
    funGetAllsubCategoryDetails:funGetAllsubCategoryDetails=(obj,db)=> {
        return new Promise((resolve, reject) => {
            try{
                var arrayAllObjData =[];
                query = {strStatus: 'N'}
                
                var intSkipCount =0;
                var intPageLimit =0;
                if(obj.intSkipCount)
                    intSkipCount = parseInt(obj.intSkipCount);
                if(obj.intPageLimit)
                    intPageLimit = parseInt(obj.intPageLimit);

                var lookupMainCategory = {
                    $lookup: {
                        from: config.CATEGORY_COLLECTION,
                        let: {intCatIds: "$fkIntCategoryId", strStatus: "N"},
                        pipeline: [
                            {$match: {$expr: {$and:
                                            [
                                                {$eq: ["$strStatus", "$$strStatus"]},
                                                {$eq: ["$pkIntCategoryId", "$$intCatIds"]},
                                            ]}}},
                            { $project: {CategoryName: 1, pkIntCategoryId: 1, _id: 0} }
                        ],
                        as: "arrayMainCategory"
                    }
                };
                let unwindarrayMainCategory = {$unwind : "$arrayMainCategory"}
                var Project = { $project : {
        
                    _id:"$_id",
                    pkIntCategoryId: "$pkIntCategoryId",
                    SubCategoryName:"$SubCategoryName", 
                    fkIntCategoryId:"$fkIntCategoryId", 
                    icon_file_urls:"$icon_file_urls", 
                    img_file_urls:"$img_file_urls", 
                    status:"$status", 
                    "arrayMainSubCategory":"$arrayMainSubCategory"
                }};

                db.collection(config.SUBCATEGORY_COLLECTION).find(query).count()
                    .then((totalPageCount) => {
                        if(totalPageCount){
                            if(!intPageLimit)
                                intPageLimit =parseInt(totalPageCount);
                            db.collection(config.SUBCATEGORY_COLLECTION).aggregate([{$match:query},
                                { "$skip": intSkipCount }, { "$limit": intPageLimit },{$sort:{name:1}},
                                lookupMainCategory,
                                unwindarrayMainCategory,
                                Project
                            ]).toArray( (err,doc) => {
                                if (err) throw err;
                                if(doc){
                                    var objTotal ={intTotalCount :totalPageCount};
                                    arrayAllObjData.push(doc);
                                    arrayAllObjData.push(objTotal);
                                    resolve({success: true,message: 'Successfully.', data: arrayAllObjData});
                                }
                            });
                        } else {
                            resolve({success: false, message: ' No Data Found', data: arryEmpty});
                        }
                    })
        
            } catch (e) {
                throw resolve( { success: false, message: 'System '+e, data: arryEmpty });
            }
        });
    
    },
}