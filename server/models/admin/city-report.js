
const config = require('../../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

        //This fucntion validate details from city form.
    funGetAllCities:getAll=(obj,db)=> {
        return new Promise((resolve, reject) => {
            try{
                if (obj.intStateId && obj.intCountryId){
                    var strWhere ={$match:{fkIntStateId:ObjectID(obj.intStateId),fkIntCountryId:ObjectID(obj.intCountryId),strStatus:'N'}};
                    var Project = { $project :{pkIntCityId:"$pkIntCityId",CityName:"$CityName",_id:0}};
                    db.collection(config.CITY_COLLECTION).aggregate([strWhere,Project]).toArray( (err, doc)  => {
                        if (err) throw err;
                        resolve({success: true,message: 'Successfully.', data: doc});
                    });
                }else if(obj.intStateId){
                    var strWhere ={$match:{fkIntStateId:ObjectID(obj.intStateId),strStatus:'N'}};
                    var Project = { $project :{pkIntCityId:"$pkIntCityId",CityName:"$CityName",_id:0}};
                    db.collection(config.CITY_COLLECTION).aggregate([strWhere,Project]).toArray( (err, doc)  => {
                        if (err) throw err;
                        resolve({success: true,message: 'Successfully.', data: doc});
                    });
                }else {
                    var strWhere ={$match:{strStatus:'N'}};
                    var Project = { $project :{pkIntCityId:"$pkIntCityId",CityName:"$CityName",_id:0}};
                    db.collection(config.CITY_COLLECTION).aggregate([strWhere,Project]).toArray( (err, doc)  => {
                        if (err) throw err;
                        resolve({success: true,message: 'Successfully.', data: doc});
                    });
                }

            } catch (e) {
                throw resolve( { success: false, message: 'System '+e, data: arryEmpty });
            }
        });
    },

       //This function listing details from city form.
    funGetAllCityDetails:funGetAllCityDetails=(obj,db)=> {
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

                // var Project = { $project : {
                //     _id:"$_id",
                //     pkIntCountryId: "$pkIntCountryId",
                //     CountryName:"$CountryName", 
                // }};
    
                db.collection(config.CITY_COLLECTION).find(query).count()
                    .then((totalPageCount) => {
                        if(totalPageCount){
                            if(!intPageLimit)
                                intPageLimit =parseInt(totalPageCount);
                            db.collection(config.CITY_COLLECTION).aggregate([{$match:query},
                                { "$skip": intSkipCount }, { "$limit": intPageLimit },{$sort:{name:1}},
                                // Project
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