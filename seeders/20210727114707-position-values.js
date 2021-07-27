'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Positions', [
      {
        positionCode:'UTA',
        positionName:'Direktur Utama',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        positionCode:'KEP',
        positionName:'Direktur Kepatuhan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        positionCode:'KEU',
        positionName:'Direktur Keuangan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        positionCode:'KON',
        positionName:'Direktur Konsumer dan Ritel',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        positionCode:'KOM',
        positionName:'Direktur Komersial dan UMKM',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        positionCode:'ITI',
        positionName:'Direktur IT, Treasury dan International Banking',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        positionCode:'OPS',
        positionName:'Direktur Operasional',
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
