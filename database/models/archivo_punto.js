module.exports = (sequelize, DataTypes) => {
  const Archivo_Punto = sequelize.define('Archivo_Punto', {
    id_archivo_punto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_punto: {
      type: DataTypes.INTEGER, allowNull: false, references: {
        model: {
          tableName: 'Punto'
        },
        key: 'id_punto'
      }
    },
    direccion: { type: DataTypes.STRING, allowNull: false }
  }, {
    freezeTableName: true
  });
  Archivo_Punto.associate = function (models) {
    // associations can be defined here
  };
  return Archivo_Punto;
};