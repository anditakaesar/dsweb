'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      grantorName: {
        type: Sequelize.STRING
      },
      granteeName: {
        type: Sequelize.STRING
      },
      granteePosition: {
        type: Sequelize.STRING
      },
      travelDeparture: {
        type: Sequelize.STRING
      },
      travelDestination: {
        type: Sequelize.STRING
      },
      travelType: {
        type: Sequelize.STRING
      },
      travelReason: {
        type: Sequelize.TEXT
      },
      travelArrival: {
        type: Sequelize.STRING
      },
      travelArrivalDate: {
        type: Sequelize.DATEONLY
      },
      travelDate: {
        type: Sequelize.DATEONLY
      },
      travelLength: {
        type: Sequelize.INTEGER
      },
      travelLengthType: {
        type: Sequelize.INTEGER
      },
      guarantorName: {
        type: Sequelize.STRING
      },
      otherInfo: {
        type: Sequelize.TEXT
      },
      numPrefix: {
        type: Sequelize.STRING
      },
      numMiddle: {
        type: Sequelize.STRING
      },
      numPostfix: {
        type: Sequelize.STRING
      },
      numYear: {
        type: Sequelize.STRING
      },
      numCombined: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Entries');
  }
};