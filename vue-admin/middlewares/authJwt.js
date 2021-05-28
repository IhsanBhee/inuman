const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { role } = require("../models");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(403).send({
                message: "Unauthorized!"
            });
        }

        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId)
    .then(user => {
        if(user) {
            Role.findOne({
                where:{
                    id: user.id
                }
            })
            .then(role =>{
                 if ( role.name === "admin") {
                     next();
                     return;
                 }
 
                 res.status(403).send({
                     message: "Required Admin Role!"
                 });
                 return;
            });
         }
    });
};

isModerator = (req, res, next) => {
    User.findByPk(req.userId)
    .then(user => {
        if(user) {
           Role.findOne({
               where:{
                   id: user.id
               }
           })
           .then(role =>{
                if ( role.name === "moderator") {
                    next();
                    return;
                }

                res.status(403).send({
                    message: "Required Moderator Role!"
                });
                return;
           });
        }
    });
};

isAdminOrModerator = (req, res, next) => {
    User.findByPk(req.userId)
    .then(user => {
        if(user) {
            Role.findOne({
                where:{
                    id: user.id
                }
            })
            .then(role =>{
                console.log("flag: " + role.name);
                 if ( role.name === "moderator") {
                     next();
                     return;
                 }

                 if ( role.name === "admin") {
                    next();
                    return;
                }
 
                 res.status(403).send({
                     message: "Required Moderator or Admin Role!"
                 });
                 return;
            });
         }
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isAdminOrModerator: isAdminOrModerator
};

module.exports = authJwt;