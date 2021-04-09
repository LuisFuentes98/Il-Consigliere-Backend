module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Consejo', {
      consecutivo: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      id_tipo_sesion: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Tipo_Sesion',
          },
          key: 'id_tipo_sesion'
        }
      },
      institucion: {
        allowNull: false,
        type: Sequelize.STRING
      },
      carrera: {
        allowNull: false,
        type: Sequelize.STRING
      },
      campus: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nombre_consejo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fecha: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      hora: {
        allowNull: false,
        type: Sequelize.TIME
      },
      limite_solicitud: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      lugar: {
        allowNull: false,
        type: Sequelize.STRING
      },
      editable: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Consejo');
  }
};