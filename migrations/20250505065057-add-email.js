"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "staffs",
      "email",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      {
        timestamps: false,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("staffs");
  },
};
