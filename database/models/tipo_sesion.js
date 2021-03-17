module.exports = (sequelize, DataTypes) => {
  const Tipo_Sesion = sequelize.define('Tipo_Sesion', {
    id_tipo_sesion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true
  });
  Tipo_Sesion.associate = function (models) {
    // associations can be defined here
  };
  return Tipo_Sesion;
};