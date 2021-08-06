'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Entries', 'travelDateBack', Sequelize.DATEONLY);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Entries', 'travelDateBack');
  }
};
