module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Correo', {
      correo: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      cedula: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Usuario',
          },
          key: 'cedula'
        }
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
    return queryInterface.dropTable('Correo');
  }
};