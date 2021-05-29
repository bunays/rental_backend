
const config = require('../../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

     //This function auto complete listing details from country form.
    funGetAllCountries:getAllAutoCompleteCountry=(obj,db)=> {
        return new Promise((resolve, reject) => {
            try{
                if(obj.strDocumentNo){
                    var strWhere ={$match:{pkIntCountryId:ObjectID(obj.strDocumentNo),strStatus:'N',fkIntParentId:null}};
                    var Project = { $project :{pkIntCountryId:"$pkIntCountryId",strCountryName:"$strCountryName",_id:0}};
                    db.collection(config.COUNTRY_COLLECTION).aggregate([strWhere,Project]).toArray( (err, doc)  => {
                        if (err) throw err;
                        resolve({success: true,message: 'Successfully.', data: doc});
                    });
                } else {
                    var strWhere ={$match:{strStatus:'N',fkIntParentId:null}};
                    var Project = { $project :{pkIntCountryId:"$pkIntCountryId",strCountryName:"$strCountryName",_id:0}};
                    db.collection(config.COUNTRY_COLLECTION).aggregate([strWhere,Project]).toArray( (err, doc)  => {
                        if (err) throw err;
                        resolve({success: true,message: 'Successfully.', data: doc});
                    });
                }

            } catch (e) {
                throw resolve( { success: false, message: 'System '+e, data: arryEmpty });
            }
        });
    },

    //This function listing details from country form.
    funGetAllCOUNTRYDetails:funGetAllCOUNTRYDetails=(obj,db)=> {
        return new Promise((resolve, reject) => {
            try{
                var arrayAllObjData =[];
                query= {strStatus:'N'}
                
                var intSkipCount =0;
                var intPageLimit =0;
                if(obj.intSkipCount)
                    intSkipCount = parseInt(obj.intSkipCount);
                if(obj.intPageLimit)
                    intPageLimit = parseInt(obj.intPageLimit);

                var Project = { $project : {
                    _id:"$_id",
                    pkIntCountryId: "$pkIntCountryId",
                    CountryName:"$CountryName", 
                }};
    
                db.collection(config.COUNTRY_COLLECTION).find(query).count()
                    .then((totalPageCount) => {
                        if(totalPageCount){
                            if(!intPageLimit)
                                intPageLimit =parseInt(totalPageCount);
                            db.collection(config.COUNTRY_COLLECTION).aggregate([{$match:query},
                                { "$skip": intSkipCount }, { "$limit": intPageLimit },{$sort:{name:1}},
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