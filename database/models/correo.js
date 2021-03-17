module.exports = (sequelize, DataTypes) => {
  const Correo = sequelize.define('Correo', {
    correo: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    cedula: {
      type: DataTypes.STRING, allowNull: false, references: {
        model: {
          tableName: 'Usuario'
        },
        key: 'cedula'
      }
    }
  }, {
    freezeTableName: true
  });
  Correo.associate = function (models) { };
  return Correo;
};