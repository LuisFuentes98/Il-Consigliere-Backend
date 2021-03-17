module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Votacion', {
      id_votacion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_punto: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Punto',
          },
          key: 'id_punto'
        }
      },
      favor: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      contra: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      abstencion: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Votacion');
  }
};