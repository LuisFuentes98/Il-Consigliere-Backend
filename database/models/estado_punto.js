module.exports = (sequelize, DataTypes) => {
  const Estado_Punto = sequelize.define('Estado_Punto', {
    id_tipo_punto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true
  });
  Estado_Punto.associate = function (models) {
    // associations can be defined here
  };
  return Estado_Punto;
};