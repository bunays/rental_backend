const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

    funGetAllStates:getAll=(obj,db)=> {
        return new Promise((resolve, reject) => {
            try{
                if(obj.intCountryId){
                    var strWhere ={$match:{fkIntCountryId:ObjectID(obj.intCountryId),strStatus:'N',fkIntParentId:null}};
                    var Project = { $project :{pkIntStateId:"$pkIntCountryId",strStateName:"$strStateName",pkIntStateId:"$pkIntStateId",_id:0}};
                    db.collection(config.STATE_COLLECTION).aggregate([strWhere,Project]).toArray( (err, doc)  => {
                        if (err) throw err;
                        resolve({success: true,message: 'Successfully.', data: doc});
                    });
                    
                } else {
                    var strWhere ={$match:{strStatus:'N',fkIntParentId:null}};
                    var Project = { $project :{pkIntStateId:"$pkIntStateId",strStateName:"$strStateName",pkIntStateId:"$pkIntStateId",_id:0}};
                    db.collection(config.STATE_COLLECTION).aggregate([strWhere,Project]).toArray( (err, doc)  => {
                        if (err) throw err;
                        resolve({success: true,message: 'Successfully.', data: doc});
                    });
                }

            } catch (e) {
                throw resolve( { success: false, message: 'System '+e, data: arryEmpty });
            }
        });
    },

    funGetAllStateDetails:funGetAllStateDetails=(obj,db)=> {
    return new Promise((resolve, reject) => {
    try{
        var arrayAllObjData =[];
        query= {strStatus: 'N'}

        var intSkipCount =0;
        var intPageLimit =0;
        if(obj.intSkipCount)
            intSkipCount = parseInt(obj.intSkipCount);
        if(obj.intPageLimit)
            intPageLimit = parseInt(obj.intPageLimit);
       
        var lookupMainCity = {
            $lookup: {
                from: config.CITY_COLLECTION,
                let: {intCatIds: "$pkIntStateId", strStatus: "N"},
                pipeline: [
                    {$match: {$expr: {$and:
                                    [
                                        {$eq: ["$strStatus", "$$strStatus"]},
                                        {$eq: ["$fkIntStateId", "$$intCatIds"]},
                                    ]}}},
                    { $project: {strCityName: 1, fkIntStateId: 1, _id: 0} }
                ],
                as: "arrayMainCity"
            }
        };
        let unwindarrayMainState = {$unwind : "$arrayMainCity"}
        var Project = { $project :
                {
                    pkIntStateId: "$pkIntStateId",
                    strStateName:"$strStateName",
                    strCityName:"$strCityName",
                    datCreateDateAndTime: "$datCreateDateAndTime",
                    datLastModifiedDateTime:"$datLastModifiedDateTime",
                    fkIntCountryId:"$fkIntCountryId",
                    strStatus:"$strStatus",
                    "arrayMainCity":"$arrayMainCity.strCityName",
                   
                }};
                
                
        db.collection(config.STATE_COLLECTION).find(query).count()
            .then((totalPageCount) => {
                if(totalPageCount){
                    if(!intPageLimit)
                        intPageLimit =parseInt(totalPageCount);
                    db.collection(config.STATE_COLLECTION).aggregate([{$match:query},
                        { "$skip": intSkipCount }, { "$limit": intPageLimit },
                        lookupMainCity,
                         unwindarrayMainState,
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