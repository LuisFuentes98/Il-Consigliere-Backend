module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tipo_Convocado', [{
      descripcion: 'Docente'
    },
    {
      descripcion: 'Administrativo'
    },
    {
      descripcion: 'Estudiante'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tipo_Convocado', null, {});
  }
};
