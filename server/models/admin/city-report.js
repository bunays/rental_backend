
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
  
}