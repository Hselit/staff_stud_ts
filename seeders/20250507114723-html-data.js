"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("html", [
      {
        type: "html",
        content: `
          <html>
            <h1>Understanding the Basics of HTML</h1>
            <p>HTML (HyperText Markup Language) is the standard markup language used to create web pages. It provides the basic structure of a webpage and is enhanced by CSS and JavaScript to create modern, interactive websites.</p>
          </html>
        `,
      },
      {
        type: "css",
        content: `
          <html>
            <h1>What is CSS?</h1>
            <p>CSS (Cascading Style Sheets) controls the presentation of web pages, allowing you to style and layout your HTML elements with colors, spacing, fonts, and more.</p>
          </html>
        `,
      },
      {
        type: "js",
        content: `
          <html>
            <h1>Getting Started with JavaScript</h1>
            <p>JavaScript is a scripting language used to create dynamic behavior on websites, such as form validation, animations, and interactive elements.</p>
          </html>
        `,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("html", null, {});
  },
};
