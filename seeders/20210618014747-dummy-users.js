'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'userone',
        password: '$2b$11$8gqLmWDpm2jd/Z2bHDQ.rO9/eqKDX2DcyA/hfwJtdJN6aQmMYKw8a',
        role: 'staff',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'usertwo',
        password: '$2b$11$8gqLmWDpm2jd/Z2bHDQ.rO9/eqKDX2DcyA/hfwJtdJN6aQmMYKw8a',
        role: 'staff',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { role: 'staff' }, {});
  }
};
