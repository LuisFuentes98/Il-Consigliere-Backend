module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Usuario_Permiso', {
      id_usuario_permiso: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cedula: {
        type: Sequelize.STRING,
        references: {

          model: {
            tableName: 'Usuario',
          },
          key: 'cedula'
        }
      },
      id_permiso: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Permiso',
          },
          key: 'id_permiso',
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
    return queryInterface.dropTable('Usuario_Permiso');
  }
};