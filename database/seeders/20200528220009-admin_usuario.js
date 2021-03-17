module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Usuario', [{
      cedula: '1234',
      nombre: 'admin',
      apellido: 'admin',
      segundo_apellido: 'admin',
      clave: '$2b$10$UNirhtnN73DPD75jYoh11edJ4HIrxm1GhB8I.bWI2vrBAdDUmWqzC',
      id_tipo_convocado: 3
    }])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Usuario', null, {});
  }
};
