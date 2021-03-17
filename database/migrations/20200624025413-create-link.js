module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Link', {
      id_link: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      expiration: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      id_permiso: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      id_tipo_convocado: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cedula: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Link');
  }
};