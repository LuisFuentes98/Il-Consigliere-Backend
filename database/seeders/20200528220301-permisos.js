module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Permiso', [{
      nombre: 'Gestionar Usuarios'
    },
    {
      nombre: 'Gestionar Consejos'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permiso', null, {});
  }
};
