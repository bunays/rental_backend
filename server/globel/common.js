

const config = require('../config/config');
var strQryCount = { $group: { _id: null, count: { $sum: 1 }}};
const jwt = require('jsonwebtoken');

const express = require('express');
var ObjectID = require("mongodb").ObjectID;
const router = express.Router();

var arryEmpty = [];

var upperCase = require('upper-case');

/*
     TODO @Function:
     */





module.exports = {
    crypto: require("crypto"),
    funGetNextDocumentNumber:getNextDocNo=(objDoc,db)=> {
        return new Promise((resolve, reject) => {
            try{
                resolve(db.collection(config.DOCUMENT_NUMBER_COLLECTION).find({ strModuleName: objDoc.strModuleName  }, {
                    _id: 0,
                    intDocumentNumber: -1
                }).sort({ intDocumentNumber: -1 }).limit(1).toArray());
            }catch (e) {
                throw resolve( { success: false, message: 'System '+e, data: arryEmpty });
            }

        });
    },

// return password salt and hash
    setPassword: function (password) {
        salt = this.crypto.randomBytes(16).toString('hex');
        hash = this.crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');
        return { salt: salt, hash: hash };
    },
// validate password with exsisting
    validPassword: function (password, doc) {
        var hash = this.crypto.pbkdf2Sync(password, doc.strPrePassword, 1000, 64, 'sha1').toString('hex');
        return { hash: hash };
    },

    verifyToken: (req, res, next) =>{
        try {
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                const bearertoken = bearer[1];
                req.token = bearertoken; // Attach token to request.
                jwt.verify(req.token, config.JWT_SECRET, (err, decoded) => { // decoded value s // console.log('decoded', decoded.user);
                    if (err) {
                        return res.json({ success: false, message: 'Token Error', data: err })
                    } // Attach decoded user details to request.
                    if (!decoded) {
                        return res.status(401).end();
                    } else {
                        req.user = decoded.user;
                        next();
                    }
                })
            } else {
                return res.json({ success: false, message: 'Header Authorization Error', data: 'Header Authorization Error' })
            }

        } catch (e) {
            console.log("Error", e);
            res.status(500).json({ success: false, message: "Error: No authorization header present ::" + e, data: [] });
        }

    },

    isEmptyObject:(obj)=>{
        return !Object.keys(obj).length;
    },
    

};

