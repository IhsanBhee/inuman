const { user } = require("../models");
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, tutorials, totalPages, currentPage };
};

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a User
  const user = {
    username: req.body.username,
    full_name: req.body.full_name,
    email: req.body.email,
    password: req.body.password,
    status: req.body.status,
    role: req.body.role
  };

  // Save User in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const username = req.query.username;
  var condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;

  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll2 = (req, res) => {
  const { page, size, username } = req.query;
  var condition = username ? { username: { [Op.Like]: `%${username}%` } } : null;

  const { limit, offset } = getPagination(page, size);

  User.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if(data == null) {
        res.send({
          message: "User was not found!"
        });
      } else {
        res.send(data); 
      }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving User with id=" + id
        });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
    })
    .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "User was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete User with id=${id}. Maybe User was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete User with id=" + id
        });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all users."
        });
    });
};

// Find all Users by status
exports.findAllStatus = (req, res) => {
    User.findAll({ where: { status: 1 } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving users."
        });
    });  
};

// Find all Users by status
exports.findAllStatus2 = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  User.findAndCountAll({ where: { status: 1 } })
  .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
  })
  .catch(err => {
      res.status(500).send({
          message:
              err.message || "Some error occurred while retrieving users."
      });
  });  
};

//Access Authorization
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
}

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
}