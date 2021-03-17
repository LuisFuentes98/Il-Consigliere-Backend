module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Estado_Punto', [{
      descripcion: 'aceptado'
    },
    {
      descripcion: 'solicitado'
    },
    {
      descripcion: 'rechazado'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Estado_Punto', null, {});
  }
};
