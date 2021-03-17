module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tipo_Punto', [{
      descripcion: 'Votativo'
    },
    {
      descripcion: 'Informativo'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tipo_Punto', null, {});
  }
};
