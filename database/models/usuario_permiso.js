module.exports = (sequelize, DataTypes) => {
  const Usuario_Permiso = sequelize.define('Usuario_Permiso', {
    id_usuario_permiso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    cedula: {
      type: DataTypes.STRING, allowNull: false, references: {
        model: {
          tableName: 'Usuario'
        },
        key: 'cedula'
      }
    },
    id_permiso: {
      type: DataTypes.INTEGER, allowNull: false, references: {
        model: {
          tableName: 'Permiso'
        },
        key: 'id_permiso'
      }
    }
  }, {
    freezeTableName: true
  });
  Usuario_Permiso.associate = function (models) {
    // associations can be defined here
  };
  return Usuario_Permiso;
};