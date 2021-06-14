const config = require('../../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

module.exports = {

    
    funGetAllSettingListDetails:GetAllSettingListDetails=(obj,db)=> {
       
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

                        
                db.collection(config.SETTING_COLLECTION).find(query).count()
                    .then((totalPageCount) => {
                        if(totalPageCount){
                            if(!intPageLimit)
                                intPageLimit =parseInt(totalPageCount);
                            db.collection(config.SETTING_COLLECTION).aggregate([{$match:query},
                                { "$skip": intSkipCount }, { "$limit": intPageLimit },
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