module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Usuario_Permiso', [{
      cedula: '1234',
      id_permiso: 1
    },
    {
      cedula: '1234',
      id_permiso: 2
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Usuario_Permiso', null, {});
  }
};
