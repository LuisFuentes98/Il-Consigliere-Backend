module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Punto', {
      id_punto: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      consecutivo: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Consejo',
          },
          key: 'consecutivo'
        }
      },
      asunto: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      orden: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      cedula: {
        allowNull: false,
        type: Sequelize.STRING
      },
      id_tipo_punto: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Tipo_Punto'
          },
          key: 'id_tipo_punto'
        }
      },
      id_estado_punto: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Estado_Punto'
          },
          key: 'id_estado_punto'
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
    return queryInterface.dropTable('Punto');
  }
};