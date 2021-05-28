module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("m_roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });

    return Role;
}