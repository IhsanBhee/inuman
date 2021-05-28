const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    // Create a new User
    router.post("/", users.create);

    // Retrieve all Users
    router.get("/", users.findAll);

    // Retrieve all Users with paging
    // router.get("/", users.findAll2);

    // Retrieve all fullname users
    router.get("/status", users.findAllStatus);

    // Retrieve all fullname users with paging
    // router.get("/status", users.findAllStatus2);

    // Retrieve a single user with id
    router.get("/:id", users.findOne);

    router.get("/test/all", controller.allAccess);

    app.get("/api/test/user",
        [authJwt.verifyToken],
        controller.userBoard
    );

    app.get(
        "/api/test/user",
        [authJwt.verifyToken],
        controller.userBoard
    );

    // Update a user with id
    router.put("/:id", users.update);

    // Delete a user with id
    router.delete("/:id", users.delete);

    // Delete all user
    router.delete("/", users.deleteAll);

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/users', router);

    // app.get(
    //     "/api/test/user",
    //     [authJwt.verifyToken],
    //     controller.userBoard
    // );

    // app.get(
    //     "/api/test/moderator",
    //     [authJwt.verifyToken, authJwt.isModerator],
    //     controller.moderatorBoard
    // );

    // app.get(
    //     "/api/test/admin",
    //     [authJwt.verifyToken, authJwt.isAdmin],
    //     controller.adminBoard
    // );
}
 
// module.exports = function (app) {
//     app.use(function(req, res, next) {
//         res.header(
//             "Access-Control-Allow-Headers",
//             "access-token, Origin, Content-Type, Accept"
//         );
//         next();
//     });

//     app.get("/api/test/all", controller.allAccess);

//     app.get(
//         "/api/test/user",
//         [authJwt.verifyToken],
//         controller.userBoard
//     );

//     app.get(
//         "/api/test/moderator",
//         [authJwt.verifyToken, authJwt.isModerator],
//         controller.moderatorBoard
//     );

//     app.get(
//         "/api/test/admin",
//         [authJwt.verifyToken, authJwt.isAdmin],
//         controller.adminBoard
//     );
// };