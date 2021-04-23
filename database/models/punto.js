module.exports = (sequelize, DataTypes) => {
  const Punto = sequelize.define('Punto', {
    id_punto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    consecutivo: {
      type: DataTypes.STRING, allowNull: false, references: {
        model: {
          tableName: 'Consejo'
        },
        key: 'consecutivo'
      }
    },
    asunto: { type: DataTypes.TEXT, allowNull: false },
    orden: { type: DataTypes.INTEGER, allowNull: false },
    cedula: { type: DataTypes.STRING, allowNull: false },
    comentario: { type: DataTypes.STRING, allowNull: true },
    id_tipo_punto: {
      type: DataTypes.INTEGER, allowNull: false, references: {
        model: {
          tableName: 'Tipo_Punto'
        },
        key: 'id_tipo_punto'
      }
    },
    id_estado_punto: {
      type: DataTypes.INTEGER, allowNull: false, references: {
        model: {
          tableName: 'Estado_Punto'
        },
        key: 'id_estado_punto'
      }
    }
  }, {
    freezeTableName: true
  });
  Punto.associate = function (models) {
    // associations can be defined here
  };
  return Punto;
};