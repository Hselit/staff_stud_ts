"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("email", [
      {
        type: "Welcome",
        subject: "Welcome to Our Platform!",
        html: "<h1>Hi there!</h1><p>Thanks for joining us.</p>",
        cc: "support@example.com",
      },
      {
        type: "Reminder",
        subject: "Don't forget your appointment",
        html: "<p>Your appointment is scheduled for tomorrow at 10 AM.</p>",
        cc: null,
      },
      {
        type: "Promotion",
        subject: "Exclusive Offer Just for You!",
        html: "<p>Enjoy 20% off on your next purchase.</p>",
        cc: "marketing@example.com",
      },
      {
        type: "Password Reset",
        subject: "Password Reset request",
        html: `<p>For resetting your password... Click <a href="http://localhost:3000/staff/passwordreset">here</a></p>`,
        cc: null,
      },
      {
        type: "Password Reset Success",
        subject: "Password Reset Successful",
        html: `<h3 style="text-align:center;">Password Reset Success</h3><br><h2 style="text-align:center;">Thank You.....</h2>`,
        cc: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("email", null, {});
  },
};
