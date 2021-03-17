module.exports = (sequelize, DataTypes) => {
  const Votacion = sequelize.define('Votacion', {
    id_votacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_punto: {
      type: DataTypes.INTEGER, allowNull: false, references: {
        model: {
          tableName: 'Punto'
        },
        key: 'id_punto'
      }
    },
    favor: { type: DataTypes.INTEGER, allowNull: false },
    contra: { type: DataTypes.INTEGER, allowNull: false },
    abstencion: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    freezeTableName: true
  });
  Votacion.associate = function (models) {
    // associations can be defined here
  };
  return Votacion;
};