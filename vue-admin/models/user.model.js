module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("m_users", {
        // id: {
            // type: Sequelize.INTEGER,
            // primaryKey: true
        // },
        username: {
            type: Sequelize.STRING
        },
        full_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING 
        },
        password: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        role: {
            type: Sequelize.INTEGER
        },
        login_attempt: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        login_date: {
            type: Sequelize.DATE
        }
    });

    return User;
}