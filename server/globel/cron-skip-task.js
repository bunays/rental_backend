const fs = require("fs");
//let shell = require("shelljs");
const cron = require("node-cron");
const request = require('request');
const express = require("express");
const log = console.log
var username = 'admin';
var password = 'm@tajar#1';
const config = require('../config/config');
var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');


// initialize express and port number
const app = express()
const port = 3128





//Running a Task At every 10th minute.
cron.schedule('*/1 * * * *', function() {
    try{


        var today = new Date();
    log("checkCronJobChangeTaskDueStatus --->>", today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
    let body ={strValue:"cron"};
    
            //console.log(JSON.parse(body));
            const options = {
                url: config.imagePath+'/Admin/cronjobGetData',
                form: body
            };
            log(options.url)
            request.post(options, (err, res, body) => {
                if (err) {
                    return console.log(err);
                }
                log(body);
            });
    } catch (e) {
        log("Error",e)
            }
    
       
});

//app.listen("3128");




/*
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second ( optional )
*/