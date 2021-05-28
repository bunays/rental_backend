const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};

const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

    funGetAllProductDetails:listProductDetails=(obj,db)=> {
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

                var lookupMainsubCategory = {
                    $lookup: {
                        from: config.SUBCATEGORY_COLLECTION,
                        let: {intCatIds: "$fkIntsubCategoryId", strStatus: "N"},
                        pipeline: [
                            {$match: {$expr: {$and:
                                            [
                                                {$eq: ["$strStatus", "$$strStatus"]},
                                                {$eq: ["$pkIntsubCategoryId", "$$intCatIds"]},
                                            ]}}},
                            { $project: {SubCategoryName: 1, pkIntsubCategoryId: 1, _id: 0} }
                        ],
                        as: "arrayMainsubCategory"
                    }
                };
                let unwindarrayMainsubCategory = {$unwind : "$arrayMainsubCategory"}
                var Project = { $project : {
        
                    _id:"$_id",
                    pkIntProductId: "$pkIntProductId",
                    ProductName:"$ProductName", 
                    ProductId:"$ProductId", 
                    status:"$status", 
                    "arrayMainCategory":"$arrayMainCategory",
                    "arrayMainSubCategory":"$arrayMainSubCategory"
                }};

                db.collection(config.PRODUCT_COLLECTION).find(query).count()
                    .then((totalPageCount) => {
                        if(totalPageCount){
                            if(!intPageLimit)
                                intPageLimit =parseInt(totalPageCount);
                            db.collection(config.PRODUCT_COLLECTION).aggregate([{$match:query},
                                { "$skip": intSkipCount }, { "$limit": intPageLimit },{$sort:{name:1}},
                                lookupMainCategory,
                                unwindarrayMainCategory,
                                lookupMainsubCategory,
                                unwindarrayMainsubCategory,
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