const { role } = require("../models");
const db = require("../models");
const Role = db.role;
const User = db.user;

checkDuplicate = (req, res, next) => {
    //Username
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }

        //Email
        User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                });
                return;
            }

            next();
        });
    });
};

checkRoleExisted = (req, res, next) => {
    if (req.body.role) {
        Role.findOne({
            where: {
                id: req.body.role
            }
        })
        .then(role => {
            if (role == null) {
                res.status(400).send({
                    message: "Failed! Role does not exists."
                });
                return;
            }
        });
    }

    next();
};

const verifySignUp = {
    checkDuplicate: checkDuplicate,
    checkRoleExisted: checkRoleExisted
}

module.exports = verifySignUp;