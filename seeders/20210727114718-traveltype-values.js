'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('TravelTypes', [
      {
        travelName:'Dalam kota',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        travelName:'Luar kota',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        travelName:'Luar pulau',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        travelName:'Luar negeri',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
