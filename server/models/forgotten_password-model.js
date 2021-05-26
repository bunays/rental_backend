const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};


const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();
const nodemailer = require('nodemailer')
const common = require('../globel/common');
var arryEmpty = [];

var upperCase = require('upper-case');

/*
     TODO @Function:
     */

module.exports = {

    //This fucntion renter new password for user.
    funResetPasswordUpdateDetails: InsertResetPasswordDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {
                      
                let _id =obj._id;
               
                var match = {$match: {_id: ObjectID(_id)}};
                db.collection(config.USER_COLLECTION).aggregate([match, strQryCount]).toArray().then((response) => {
                    if (response.length) {
                        var passObj = common.setPassword(obj.password);
                        const newObject = {
                            password: passObj.hash,
                            strPrePassword: passObj.salt,
                        };
                        
                        var query = {_id: ObjectID(_id)};
                        db.collection(config.USER_COLLECTION).update(query, {$set: newObject}, (err, doc) => {
                            if (err) resolve({success: false, message: 'User Update Failed.', data: arryEmpty});
                            else{
                                db.collection(config.USER_COLLECTION).findOne({ _id :ObjectID(wp_id)}).then(dataexpert_details=>{
                                    resolve({success: true, message: 'User Updated successfully.', data: [dataexpert_details]});
                                });

                            }

                        })

                    } else {
                        resolve({success: false, message: 'No User found', data: arryEmpty});
                    }
                });
       
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },

    //This fucntion send mail to email adress for user.
    funForgottenPasswordUpdateDetails: ForgottenPasswordDetails = (obj, db) => {
        return new Promise((resolve, reject) => {
            try {

                let email = obj.email.toLowerCase();

                db.collection(config.USER_COLLECTION).findOne({email:obj.email}).then(fetch_emails=>{
                    if (fetch_emails) {
                        wp_id = fetch_emails._id;
                        email = obj.email;
                        let api_link = `https://lapslock.com//Resetpassword/${wp_id}@Rental`
                        let subject = "Password reset request"
                        let body =    `<!doctype html> 
                                          <p><b> Reset your password? </b></p>
                                          <p> If you requested to reset your password, click the link below. If you didn't make the request, please ignore this email </p>
                                          <a href=${api_link}>Reset Password</a>
                                          </html>`
                     
                             send_email(email, subject, body)
                            resolve({success: true, message: 'Send to your emil.',data:api_link});
                       
                    }else{
                        resolve({success: false, message: 'No data found.', data: arryEmpty});
                    }

                });
       
            } catch (e) {
                throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
            }
        });

    },


}

    //This fucntion sending mail to email adress for user.
    function send_email(email, subject, html){
        return new Promise((resolve, reject) => {
            try{
                let transporter = nodemailer.createTransport({
                    service : 'gmail',
                    auth : {
                        user : 'bunaysvk1998@gmail.com',
                        pass : 'suvmwiokeblpgkfo'
                    }
            });
        
            let mailOptions = {
                    from : 'bunaysvk1998@gmail.com',
                    to : email,
                    subject : subject,
                    html : html
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                    if (error) { console.log(error) } 
                    else { console.log('Email sent: ' + info.response) }
            });


        } catch (e) {
            throw resolve({success: false, message: 'System ' + e, data: arryEmpty});
        }
        })
    }