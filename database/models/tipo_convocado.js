module.exports = (sequelize, DataTypes) => {
  const Tipo_Convocado = sequelize.define('Tipo_Convocado', {
    id_tipo_convocado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true
  });
  Tipo_Convocado.associate = function (models) {
    // associations can be defined here
  };
  return Tipo_Convocado;
};