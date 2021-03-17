module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    cedula: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: false },
    segundo_apellido: { type: DataTypes.STRING, allowNull: false },
    clave: { type: DataTypes.STRING, allowNull: false },
    id_tipo_convocado: {
      type: DataTypes.INTEGER, allowNull: false, references: {
        model: {
          tableName: 'Tipo_Convocado'
        },
        key: 'id_tipo_convocado'
      }
    }
  }, {
    freezeTableName: true
  });
  Usuario.associate = function (models) { };
  return Usuario;
};