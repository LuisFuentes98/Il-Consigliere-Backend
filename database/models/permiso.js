module.exports = (sequelize, DataTypes) => {
  const Permiso = sequelize.define('Permiso', {
    id_permiso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true
  });
  Permiso.associate = function (models) { };
  return Permiso;
};