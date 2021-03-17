module.exports = (sequelize, DataTypes) => {
  const Tipo_Punto = sequelize.define('Tipo_Punto', {
    id_tipo_punto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true
  });
  Tipo_Punto.associate = function (models) {
    // associations can be defined here
  };
  return Tipo_Punto;
};