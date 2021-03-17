module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tipo_Sesion', [{
      descripcion: 'Ordinaria'
    },
    {
      descripcion: 'Extraordinaria'
    }
      , {
      descripcion: 'Consulta Formal'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tipo_Sesion', null, {});
  }
};
