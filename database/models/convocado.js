module.exports = (sequelize, DataTypes) => {
  const Convocado = sequelize.define('Convocado', {
    id_convocado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    consecutivo: {
      type: DataTypes.STRING, allowNull: false, references: {
        model: {
          tableName: 'Consejo'
        },
        key: 'consecutivo'
      }
    },
    cedula: { type: DataTypes.STRING, allowNull: false },
    limite_solicitud: { type: DataTypes.DATEONLY, allowNull: false }
  }, {
    freezeTableName: true
  });
  Convocado.associate = function (models) {
    // associations can be defined here
  };
  return Convocado;
};