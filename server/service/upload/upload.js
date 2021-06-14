module.exports = (app, db) => {

    const express = require('express');
    var ObjectID = require("mongodb").ObjectID;
    const router = express.Router();
    /* const csv = require('fast-csv');
    const fs = require('fs');*/
    const config = require('../../config/config');
    const common = require('../../globel/common');
    // const USERMODELS = require('../models/user-models');
    // const USERREPORT  = require('../models/user-report-models');
    const arryEmpty =[];

    const multer = require('multer');
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'images/uploads/');
      },
      filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
      }
    });

    /* Upload File Api */
    var upload = multer({ storage: storage });
    app.post('/api/Upload/file_upload',  upload.single('file'), function (req, res) { 
        try {
            if(req.file && req.file.originalname && req.file.path){
                var fileId = ObjectID();
                var filePath = req.file.path;
                var fileName = req.file.filename;
                var originalName = req.file.originalname;
                var intUserId = req.body.intLoginUserId;
                var strUserId = req.body.strUserId;
        
                console.log(req.body)
                filePath = (filePath && typeof filePath === 'string')?filePath.trim():null;
                fileName = (fileName && typeof fileName === 'string')?fileName.trim():null;
                originalName = (originalName && typeof originalName === 'string')?originalName.trim():null;
                intUserId = (intUserId && typeof intUserId === 'string')?ObjectID(intUserId.trim()):null;
                strUserId = (strUserId && typeof strUserId === 'string')?ObjectID(strUserId.trim()):null;
                var fileData = { fileId: fileId, filePath: filePath, originalName: originalName ,fileName:fileName};
                
                res.json({ success: true, message: 'Image uploaded successfully', data: fileData });
              
            } else {
                res.json({ success: false, message: 'File not recieved', data: arryEmpty });

                
            }
        }
        catch (e) {
        console.log("Error", e)
        res.status(500).json({ success: false, message: "Error:" + e, data: arryEmpty });
        }
    });


}