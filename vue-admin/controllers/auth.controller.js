const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = (req, res) => {
    //Save User to Database
    User.create({
        username: req.body.username,
        full_name: req.body.full_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role
    })
    .then(user => {
        if (req.body.role) {
            Role.findAll({
                where: {
                    id: req.body.role
                }
            })
            .then(role => {
                res.send({
                    message: "User was registered successfully!" 
                });
            });
        }
    })
    .catch(err => {
        res.status(403).send({
            message: err.message
        });
    });
};

exports.signIn = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }  
    })
    .then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User was not found!"
            });
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        var token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400 //24 hours
        });

        var authorities = [];
        
        Role.findOne({
            where: {
                id: user.role
            }
        })
        .then(role =>{
            if (!role) {
                return res.status(401).send({
                    message: "Role does not exists!"
                });
            } else {
                console.log("role.name: " + role.name);
                authorities.push("ROLE_" + role.name.toUpperCase());
                console.log("authorities: " + authorities);
            }
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: authorities,
            accessToken: token 
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};